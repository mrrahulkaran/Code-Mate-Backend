const express = require("express");
const User = require("../model/user.js");
const { UserAuth } = require("../Middelwares/auth.js");
const feedRouter = express.Router();

// find out all the user from the database except logged in user
feedRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const allUser = await User.find({ _id: { $ne: req.user._id } });
    res.json(allUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

module.exports = feedRouter;
