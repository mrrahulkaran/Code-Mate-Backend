const express = require("express");
const app = express();

// user authentication-----and--- Admin authentication

const { authUser, authAdmine } = require("./Middelwares/auth");

app.use("/admin", authAdmine, function (req, res, next) {
  next();
});
app.use("/admin/getAllUser", authAdmine, function (req, res) {
  res.send("All user data send");
});

app.use("/user", authUser, function (req, res, next) {
  next();
});

app.use("/user/data", function (req, res, next) {
  res.send("user data send");
});

app.listen(3000, () => {
  console.log("server is running on 3000 port");
});
