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

router.post("/new", (req, res, next) => {
  if(!req.body.id) {
    next(new BadRequestResponse("Please provide user id to send request"));
  }else {
    User.findById(req.user.id, (error, myProfile) => {
      if (error) {
        next(
          new BadRequestResponse(`Request couldn't be processed..Try again!`)
        );
      } else if (!myProfile) {
        next(new BadRequestResponse("Profile not found!"));
      } else if (myProfile) {
        const index = myProfile.requests.findIndex(
          (user) => user.requestId == req.body.id
        );
        if (index === -1) {
          next(new BadRequestResponse('User not found'));
        } else {
          User.findById(req.body.id, (error, user) => {
            if(error) {
              next(new BadRequestResponse(error.message));
            }else if(user) {
              const userIndex = user.requests.findIndex(
                (user) => user.requestId === req.user.id
              );
              if (index === -1) {
                next(new BadRequestResponse('User not found'));
              } else {
                myProfile.requests.splice(index,1);
                user.requests.splice(userIndex,1);
                myProfile.friends.push(req.body.id);
                user.friends.push(req.user.id);
                myProfile.save();
                user.save();
                res.send(`You're now friends`);
              }
            }
          })
        }
      }
    })
  }
})

module.exports = router;
