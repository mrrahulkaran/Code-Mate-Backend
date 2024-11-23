const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validatePassword, validateEmail } = require("../utils/validation.js");

authRouter.post("/signup", validateEmail, async (req, res) => {
  try {
    //validation of incoming data and filde that need to be required for sign up

    const { firstName, lastName, emailId, password } = req.body;

    // password encryption -- encripted password will store in db
    const passwordHash = await bcrypt.hash(password, 10);
    // Creating instance of model useing perticular keys
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    console.log(user);
    res.send("wooohoo....Profile Created ");
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("invalid email");

    // checking whether password is correct or not and....
    // creating JWT Token and push user id as secret data
    // sending jwt token in a cookie attached with responce
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ _id: user._id }, "rahul");
      res.cookie("token", token);
      res.send("Login successful!");
    } else {
      res.status(400).send("p - invalid credential");
    }
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

module.exports = authRouter;
