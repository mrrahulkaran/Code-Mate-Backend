const express = require("express");
const User = require("../model/user");
const { UserAuth } = require("../Middelwares/auth.js");
const feedRouter = express.Router();

feedRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const allUser = await User.find();
    res.json(allUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

module.exports = feedRouter;
