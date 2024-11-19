const express = require("express");
const connenctDB = require("./config/database");
const app = express();
const User = require("./model/user");

app.use(express.json());

//API -- sign up
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(req.body);
  await user.save();
  res.send("User added succesessfully");
});

// API -- feed api to see all the users in DB
app.get("/feed", async (req, res) => {
  try {
    const allUser = await User.find();
    res.json(allUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

// API-  find a user by Email
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  console.log(emailId);

  try {
    const user = await User.findOne({ emailId: emailId });
    console.log(user);

    res.send(user);
  } catch (error) {
    res.status(404).send("User not found");
  }
});

//API -delete a user by emailId

app.delete("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.findOneAndDelete(emailId);
    res.send("user deleted succsessfully");
  } catch (error) {
    res.status(404).send("User not found");
  }
});

// API- update a user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

connenctDB()
  .then(() => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.error("database connection established");
  });

app.listen(3000, () => {
  console.log("server is running on 3000 port");
});
