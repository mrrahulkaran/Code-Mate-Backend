const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/home", function (req, res) {
  res.send("welcome home");
});

app.get("/data", function (req, res) {
  res.send("no data right now");
});

/* app.get("/app", function (req, res) {
  res.send("in progress");
}); */

app.listen(3000, () => {
  console.log("server is running on 3000 port");
});

// console.log("starting the project");
