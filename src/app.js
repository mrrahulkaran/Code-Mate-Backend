const express = require("express");
const connenctDB = require("./config/database");
const app = express();
const User = require("./model/user");

app.use(express.json());

//API -- sign up
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);

    const emailIDExists = await User.findOne({ emailId: req.body.emailId });
    if (emailIDExists) return res.status(400).send("Email already taken");

    if (user.Password.length < 7)
      return res.status(400).send("Password must contain 7 Charactor");

    await user.save();
    console.log(user);
    res.send("wooohoo....Profile Created ");
  } catch (error) {
    res.status(400).send("SOME ERROR ACCOURS: " + error);
  }
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

  const emailIDExists = await User.findOne({ emailId: req.body.emailId });
  if (!emailIDExists) return res.status(400).send("Email Not Exist");
  console.log(emailId.value);
  try {
    await User.findOneAndDelete({ emailId: emailId });
    res.send("user deleted succsessfully");
    console.log(emailId.value);
  } catch (error) {
    res.status(404).send("User not found");
  }
});

// API- update a user
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    console.log(userId);
    console.log(data);
    const ALLOWED_UPDATES = [
      "lastName",
      "Password",
      "photoUrl",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (isUpdateAllowed) return res.status(400).send("Can Not Update fields");
    if (data?.skills.lenght > 10)
      return res.status(400).send("Skills Not more than 10");

    await User.findByIdAndUpdate({ _id: userId }, data);

    res.send("user updated successfully");
  } catch (Error) {
    res.status(400).send("something went wrong" + Error);
  }
});

/* app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
}); */

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
