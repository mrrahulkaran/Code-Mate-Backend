const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const { UserAuth } = require("../Middelwares/auth.js");

userRouter.get("/user/request", UserAuth, async (req, res) => {
  const loginuser = req.user;
  try {
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "skills",
    ];
    const connections = await ConnectionRequest.find({
      reciverId: loginuser._id,
      status: "intrested",
    }).populate("senderId", USER_SAFE_DATA);
    res.json({ message: "Data fetched Succsessfully ", data: connections });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

userRouter.get("/user/all/connections", UserAuth, async (req, res) => {
  try {
    const loginuser = req.user;
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "skills",
    ];

    const connectionsReq = await ConnectionRequest.find({
      $or: [
        { receverId: loginuser._id, status: "accsepted" },
        { senderId: loginuser._id, status: "accsepted" },
      ],
    })
      .populate("senderId", USER_SAFE_DATA)
      .populate("reciverId", USER_SAFE_DATA);

    const data = connectionsReq.map((row) => {
      if (row.senderId._id.toString() === loginuser._id.toString()) {
        return row.receverId;
      }
      return row.senderId;
    });

    res.json({ data: data });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

module.exports = userRouter;
