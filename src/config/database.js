const mongoose = require("mongoose");

const connenctDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = connenctDB;
