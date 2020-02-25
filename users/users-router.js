const express = require("express");
const userData = require("./users-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secret");
const restricted = require("../auth/restricted-mw");
const router = express();

router.use(express.json());

router.get("/users", restricted, (req, res) => {
  userData
    .getUsers()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: err });
    });
});

router.post("/register", (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 12);
  credentials.password = hash;
  userData
    .register(credentials)
    .then(register => {
      res.status(200).json(register);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: err });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  userData
    .login({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // jwt
        const token = signToken(user);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "something went wrong logging in" });
    });
});

function signToken(user) {
  const payload = { userId: user.id, username: user.username };
  const options = { expiresIn: "8h" };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
