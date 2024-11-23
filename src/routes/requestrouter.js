const express = require("express");
const requestRouter = express.Router();
const User = require("../model/user");
const { UserAuth } = require("../Middelwares/auth.js");

requestRouter.post("/sendconnection", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " Send a connection Request");
  } catch (error) {
    res.status(404).send("");
  }
});
module.exports = requestRouter;
