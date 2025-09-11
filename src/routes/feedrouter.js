const express = require("express");
const User = require("../model/user.js");
const { UserAuth } = require("../Middelwares/auth.js");
const feedRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest.js");

// find out all the user from the database except logged in user and his connections and $accsepted request
feedRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "about",
      "skills",
    ];
    // console.log(loginuser._id.toString());

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) {
      limit = 50;
    }
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ senderId: loggedInUser._id }, { reciverId: loggedInUser._id }],
    }).select("senderId  reciverId");

    console.log(connectionRequests);

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.senderId.toString());
      hideUsersFromFeed.add(req.reciverId.toString());
    });

    console.log(hideUsersFromFeed);

    const allUser = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA.join(" "))
      .skip(skip)
      .limit(limit);

    res.json(allUser);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

module.exports = feedRouter;
