const express = require("express");
const app = express();

app.get("/app", function (req, res) {
  res.send("in progress");
});

app.post("/user", function (req, res) {
  res.send("user updated in data base");
});

app.get("/user", function (req, res) {
  res.send({ name: "rahul", phone: "7388378005" });
});

//advance rounting concepts
//we can use regularexpression in routing string

app.get("/ab?c", function (req, res) {
  res.send("abc");
});

app.get("/ab+c", function (req, res) {
  res.send("abc");
});

app.get("/ab*cd", function (req, res) {
  res.send("abcd");
});

app.get("/a(bc)?d", function (req, res) {
  res.send("abcd");
});

app.listen(3000, () => {
  console.log("server is running on 3000 port");
});
