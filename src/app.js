const express = require("express");
const connenctDB = require("./config/database");
const app = express();
const User = require("./model/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

//API -- sign up
// API -- Login user
// API -- USER profile
const authRouter = require("./routes/authrouter.js");
const profileRouter = require("./routes/profilerouter");
const requestRouter = require("./routes/requestrouter");
const feedRouter = require("./routes/feedrouter");
const userRouter = require("./routes/userrouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", feedRouter);
app.use("/", userRouter);

// API -- feed api to see all the users in DB

// API-  To send connection request

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
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
      "lastName",
      "Password",
      "photoUrl",
      "about",
      "skills",
      "firstName",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) return res.status(400).send("Can Not Update fields");
    /* if (data.includes.skills.length > 10)
      return res.status(400).send("Skills Not more than 10"); */

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });

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
