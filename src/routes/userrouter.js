const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const { UserAuth } = require("../Middelwares/auth.js");

userRouter.get("/user/request", UserAuth, async (req, res) => {
  const loginuser = req.user;
  try {
    const connections = await ConnectionRequest.find({
      reciverId: loginuser._id,
      status: "intrested",
    }).populate("senderId", ["firstName", "lastName"]);

    console.log(connections);

    res.json({ message: "Data fetched Succsessfully ", data: connections });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

module.exports = userRouter;
