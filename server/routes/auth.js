const jwt = require("jsonwebtoken"),
      secret = require("../config/env/development").secret;

const verifyToken = function (req, res, next) {
  const { authorization } = req.headers;
  if (
    (authorization && authorization.split(" ")[0] === "Token") ||
    (authorization && authorization.split(" ")[0] === "Bearer")
  ) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, secret, (error, data) => {
        if(error) {
            res.send({error : {message : "Log in first"}});
        }else {
            req.user = data;
            next();
        }
      });
    } catch {
      res.send({ error: { message: "Token expired.Please log in again!!" } });
    }
  } else {
    res.send("You've to log in first to access this service.");
  }
};

const auth = {
    verifyToken
};

module.exports = auth;
