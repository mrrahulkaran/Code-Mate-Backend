const validator = require("validator");

const User = require("../model/user");

const validateEmail = async (req, res, next) => {
  const emailIDExists = await User.findOne({ emailId: req.body.emailId });
  if (emailIDExists) {
    res.status(400).send("Email is already Exist");
  } else {
    next();
  }
};

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

module.exports = { validatePassword, validateEmail };
