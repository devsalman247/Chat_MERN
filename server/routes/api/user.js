const router = require("express").Router(),
  passport = require("passport"),
  strategy = require("../../config/passport"),
  auth = require("../auth"),
  User = require("../../models/User");
const {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

passport.use(strategy);

router.post("/signup", (req, res, next) => {
  const { name, email, password, about } = req.body;
  if (!email || !password || !name || !about) {
    return next(
      new BadRequestResponse({ message: "Please provide all input fields!" })
    );
  }
  const user = new User({
    name,
    email,
    about,
    requests: [],
    friends: [],
    groups: [],
    blocked: [],
    archivedChats: [],
  });
  user.hash = password;
  user.setPassword();
  user
    .save()
    .then((data) => {
      if (!data) {
        next(
          new BadRequestResponse({ message: "Signed up failed.Try again!" })
        );
      }
      next(new OkResponse(user.toAuthJSON()));
    })
    .catch((err) => {
      next(new BadRequestResponse(err.message));
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(
      new BadRequestResponse({
        message: "Email and password field must be provided to login.",
      })
      );
    }else {
      passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        next(new BadRequestResponse(err.message));
      }
      if (user) {
        next(new OkResponse({ user: user.toAuthJSON() }));
      } else {
        next(new UnauthorizedResponse(info));
      }
    })(req, res, next);
    }
});

router.get("/profile", auth.verifyToken, (req, res, next) => {
  User.findById(req.user.id)
    .then((user, error) => {
      if (error) {
        res.send({ error: { message: error.message } });
      }
      res.send(user);
    })
    .catch((err) => res.send({ error: { message: err.message } }));
});

router.post("/search", auth.verifyToken, (req, res, next) => {
  if(!req.body.name) {
    next(new BadRequestResponse({message : "Enter a name to search"}));
  }else {
    User.find({name : {$regex : `^${req.body.name}`, $options : 'i'}}, (error, users) => {
      if(error) {
        next(new BadRequestResponse(error.message));
      }else if(!users) {
        next(new BadRequestResponse("User not found"));
      }else {
        res.send(users.filter(user => user.id!==req.user.id));
      }
    })
  }
})

module.exports = router;
