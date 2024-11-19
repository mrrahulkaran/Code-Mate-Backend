const mongoose = require("mongoose");

const connenctDB = async () => {
  await mongoose.connect(
    "mongodb+srv://karanr9991:rahulkaran@cluster0.ner1v.mongodb.net/devTinder"
  );
};

module.exports = connenctDB;
