const express = require("express");
const app = express();

// user authentication-----

app.use("/user", function (error, req, res, next) {
  res.send("in progress");
});

app.listen(3000, () => {
  console.log("server is running on 3000 port");
});
