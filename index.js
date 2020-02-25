const express = require("express");
const helmet = require("helmet");
const userRouter = require("./users/users-router");
const server = express();
const port = 2100;

server.use(helmet());
server.use(express.json());

server.use("/api", userRouter);

server.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
