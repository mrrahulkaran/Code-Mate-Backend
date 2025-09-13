const express = require("express");
const authRouter = express.Router();
const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation.js");
const sendEmail = require("../utils/sendEmail");

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of incoming data and fields that need to be required for sign up
    await validateSignupData(req);
    // Destructuring the request body
    const { firstName, lastName, emailId, password, about } = req.body;
    // password encryption -- encripted password will store in db
    const passwordHash = await bcrypt.hash(password, 10);
    // Creating instance of model useing perticular keys
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      about,
    });

    // Saving user to the database

    const saveUser = await user.save();

    const token = await saveUser.getJWT();
    // sending jwt token in a cookie attached with response
    res.cookie("token", token);
    const emailRes = await sendEmail.run(
      "New User Registerd in Your Application",
      "User Name  -" +
        saveUser.firstName +
        "  " +
        saveUser.lastName +
        "  ," +
        " UserEmail  -" +
        saveUser.emailId
    );

    res.json({ message: "wooohoo....Profile Created ", data: saveUser });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});
//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // finding user in db by emailId if not exist throw error
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("invalid email");

    // checking whether password is correct or not and....if matched then ---
    const isMatch = await user.validatePassword(password);
    if (isMatch) {
      // creating JWT Token and push user id as secret data
      const token = await user.getJWT();
      // sending jwt token in a cookie attached with response
      res.cookie("token", token);
      res.send(user);
    } else {
      res.status(400).send("p - invalid credential");
    }
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});
//logout api
authRouter.post("/logout", async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie) throw new Error("already logged out");

    res.clearCookie("token");
    res.send("logged out succsesfully");
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

module.exports = authRouter;
