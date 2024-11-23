const jwt = require("jsonwebtoken");
const User = require("../model/user.js");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("login first");
    }

    const decodetoken = await jwt.verify(token, "rahul");

    const { _id } = decodetoken;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    //Attaching User Data that is login to req body
    req.user = user;
    console.log(user);
    next();
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
};

module.exports = { UserAuth };
