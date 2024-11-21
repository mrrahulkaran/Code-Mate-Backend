const validator = require("validator");
const User = require("../model/user");

const validateUser = async (req, res) => {
  const emailIDExists = await User.findOne({ emailId: req.body.emailId });
  if (emailIDExists) throw new Error("email exist");
  if (user.Password.length < 7) throw new Error("Password must me strong");
};

module.exports = { validateUser };
