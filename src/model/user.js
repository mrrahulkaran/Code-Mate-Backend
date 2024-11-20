const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    type: String,
    trim: true,

    maxLength: 50,
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: true,
    minLength: 7,
  },

  age: {
    type: Number,
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
  },

  about: {
    type: String,
    default: "hi there",
  },
  skills: {
    type: [String],
  },
});

module.exports = mongoose.model("User", userSchema);
