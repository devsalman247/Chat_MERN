const router = require("express").Router(),
      passport = require("passport"),
      strategy = require("../../config/passport"),
      auth = require("../auth"),
      User = require("../../models/User");

passport.use(strategy);

router.post("/signup", (req, res, next) => {
  const { name, email, password, about } = req.body;
  if (!email || !password || !name) {
    return res.status(422).send({ error: "Please provide all input fields!" });
  }
  const user = new User({
    name,
    email,
    about,
    requests : [],
    friends  : [],
    groups   : [],
    blocked  : [],
    archivedChats : [],
  });
  user.hash = password;
  user.setPassword();
  user
    .save()
    .then((data) => {
      if (!data) {
        res.send({ error: { message: "Signed up failed.Try again!" } });
      }
      res.send(user.toAuthJSON());
    })
    .catch((err) => {
      res.send({ error: { message: err.message } });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({
      error: {
        message: "Email and password field must be provided to login.",
      },
    });
  }
  passport.authenticate(
    "local",
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

router.get("/profile", auth.verifyToken, (req, res, next) => {
  User
    .findById(req.user.id)
    .populate('friends', 'name about friends groups')
    .populate('groups', 'name description admins members createdAt createdBy')
    .populate('blocked', 'name about friends groups')
    .populate('archivedChats', 'participants category')
    .exec((error, user) => {
      if (error) {
        res.send({ error: { message: error.message } });
      }
      res.send(user);
    });
});

module.exports = router;
