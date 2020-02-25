const db = require("../data/db-config");

function getUsers() {
  return db("users").select(
    "users.id",
    "users.username",
    "users.email",
    "users.department"
  );
}

function register(newUser) {
  return db("users").insert(newUser);
}

function login(username) {
  return db("users").where(username);
}

module.exports = {
  getUsers,
  register,
  login
};
