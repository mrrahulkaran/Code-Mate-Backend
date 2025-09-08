const validator = require("validator");

const User = require("../model/user");
// validate user signup data
const validateSignupData = async (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  //Check required fields
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  }
  // Email format check
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  }
  //  Check if email already exists in DB
  const existingUser = await User.findOne({ emailId });
  if (existingUser) {
    throw new Error("Email already registered");
  }
  // Password strength check (customized)
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one number and one special character."
    );
  }
};
// validate edit profile Data
const validateEditProfileData = (data) => {
  const ALLOWED_UPDATES = [
    "lastName",
    "firstName",
    "photoUrl",
    "about",
    "age",
    "gender",
    "skills",
  ];
  return Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
};

//custom validations---
// validate email
const validateEmail = async (req, res, next) => {
  const emailIDExists = await User.findOne({ emailId: req.body.emailId });
  if (emailIDExists) {
    res.status(400).send("Email is already Exist");
  } else {
    next();
  }
};
// validate password
const validatePassword = async (req, res, next) => {
  console.log(req.body.password);

  const { password } = req.body;

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  strongPasswordRegex.test(password);
  if (!validatePassword(password)) {
    return res
      .status(400)
      .send(
        "'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'"
      );
  } else {
    next();
  }
};

module.exports = {
  validatePassword,
  validateEmail,
  validateSignupData,
  validateEditProfileData,
};
