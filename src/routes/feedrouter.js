const express = require("express");
const User = require("../model/user.js");
const { UserAuth } = require("../Middelwares/auth.js");
const feedRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest.js");

// find out all the user from the database except logged in user and his connections and $accsepted request
feedRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const loginuser = req.user;
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "skills",
    ];
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) {
      limit = 50;
    }
    const skip = (page - 1) * limit;
    console.log(loginuser);
    const connectionsReq = await ConnectionRequest.find({
      $or: [
        { senderId: loginuser._id, status: "accsepted" },
        { reciverId: loginuser._id, status: "accsepted" },
      ],
    }).select("senderId reciverId");

    const hideUserFromFeed = new Set();
    connectionsReq.forEach((req) => {
      hideUserFromFeed.add(req.reciverId.toString());
      hideUserFromFeed.add(req.senderId.toString());
    });
    console.log(hideUserFromFeed);

    const allUser = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loginuser._id } },
      ],
    })
      .select(USER_SAFE_DATA.join(" "))
      .skip(skip)
      .limit(limit);

    res.json(allUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

module.exports = feedRouter;
