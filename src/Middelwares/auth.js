const jwt = require("jsonwebtoken");
const User = require("../model/user.js");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Access Denied: Login Required!");
    }

    const decodetoken = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodetoken;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    //Attaching User Data that is login to req body
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send("Opps: " + error.message);
  }
};

module.exports = { UserAuth };
