const express = require("express");
const profileRouter = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { UserAuth } = require("../Middelwares/auth.js");

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    const decodetoken = await jwt.verify(token, "rahul");

    const userProfile = await User.findOne({ _id: decodetoken._id });
    if (!userProfile) {
      throw new Error("invalid user");
    }
    res.send(userProfile);
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});
profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);

    const data = req.body;
    const ALLOWED_UPDATES = [
      "lastName",
      "Password",
      "photoUrl",
      "about",
      "skills",
      "firstName",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) throw new Error("Can not update fields");

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});
module.exports = profileRouter;
