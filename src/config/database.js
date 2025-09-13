const mongoose = require("mongoose");

const connenctDB = async () => {
  await mongoose.connect(process.env.MONGODB_SECRET_KEY);
};

module.exports = connenctDB;
