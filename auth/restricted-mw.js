const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config/secret");

module.exports = function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "token is not valid" });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "you do not have a token" });
  }
};
