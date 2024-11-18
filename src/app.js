const express = require("express");
const app = express();

app.use("/getUserData", (req, res, next) => {
  throw new error("xcscsdsf");
});

//------- Error handeling using try and cathch block

app.use("/getUserData", (req, res, next) => {
  try {
    throw new error("xcscsdsf");
  } catch {
    res.status(500).send("Some error auccured ");
  }
});

//------WildcardErrorHandeling

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("server is running on 3000 port");
});
