const router = require("express").Router(),
  auth = require("../auth"),
  User = require("../../models/User");
const {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

router.use(auth.verifyToken);

router.post("/add", (req, res, next) => {
  if (!req.body.id) {
    next(new BadRequestResponse("Please provide user id to send request"));
  } else {
    User.findById(req.body.id, (error, user) => {
      if (error) {
        next(
          new BadRequestResponse(`Request couldn't be processed..Try again!`)
        );
      } else if (!user) {
        next(new BadRequestResponse("User not found!"));
      } else if (user) {
        const index = user.requests.findIndex(
          (user) => user.requestId === req.user.id
        );
        if (index === -1) {
          next(res.send("Request has been sent"));
        } else {
          user.requests.push({
            requestId: req.user.id,
            status: 0,
          });
          User.findById(req.user.id, (err, myProfile) => {
            if (error) {
              next(
                new BadRequestResponse(
                  `Request couldn't be processed..Try again!`
                )
              );
            } else if (myProfile) {
              myProfile.requests.push({
                requestId: req.body.id,
                status: 1,
              });
              user.save();
              myProfile.save();
              next(res.send("Request has been sent"));
            }
          });
        }
      }
    });
  }
});

module.exports = router;
