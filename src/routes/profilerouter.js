const express = require("express");
const profileRouter = express.Router();
const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserAuth } = require("../Middelwares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");

// api to view user profile
profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    // Get user information from the req.user attached by authentication middleware
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});
// api to edit user profile
profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    const data = req.body;

    // Check allowed fields using validation function present in utils
    if (!validateEditProfileData(data)) {
      throw new Error("Can not update fields");
    }

    // Extra validation for skills length
    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills not more than 10");
    }

    const userId = req.user._id;
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });

    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});
// api to update user password
profileRouter.patch("/profile/update/password", UserAuth, async (req, res) => {
  try {
    const userpassword = req.body.currentpassword;
    const isMatch = await bcrypt.compare(userpassword, req.user.password);
    if (!isMatch) {
      throw new Error("Current password is invalid");
    }
    const userId = req.user._id;
    const password = req.body.newpassword;
    console.log(password);
    const updatedPassword = await bcrypt.hash(password, 10);
    const data = { password: updatedPassword };
    console.log(data);
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    console.log(updatedPassword);
    res.send("password updated successfully");
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

module.exports = profileRouter;
