const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 25,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 25,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      maxLength: 30,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      validate: {
        validator: function (value) {
          // Regex to check for at least one number and one special character
          return /(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value);
        },
        message:
          "Password must contain at least one number and one special character.",
      },
    },

    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn2.iconfinder.com/data/icons/business-hr-and-recruitment/100/account_blank_face_dummy_human_mannequin_profile_user_-512.png",

      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid url: " + value);
        }
      },
    },

    about: {
      type: String,
      default: "hi there",
      maxLength: 500,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 });

// Generate JWT token for user by Using Schema method
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "rahul", { expiresIn: "1d" });
  return token;
};
// Validate user password by using Schema method
userSchema.methods.validatePassword = async function (passwordinputbyuser) {
  const user = this;
  const passwordhash = user.password;
  const isPasswordMatch = await bcrypt.compare(
    passwordinputbyuser,
    passwordhash
  );
  return isPasswordMatch;
};

module.exports = mongoose.model("User", userSchema);
