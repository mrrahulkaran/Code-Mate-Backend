const express = require("express");
const connenctDB = require("./config/database");
const app = express();
const User = require("./model/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UserAuth } = require("./Middelwares/auth.js");
app.use(cookieParser());
app.use(express.json());

const { validatePassword, validateEmail } = require("./utils/validation.js");
//API -- sign up
app.post("/signup", validateEmail, async (req, res) => {
  try {
    //validation of incoming data and filde that need to be required for sign up

    const { firstName, lastName, emailId, password } = req.body;

    // password encryption -- encripted password will store in db
    const passwordHash = await bcrypt.hash(password, 10);
    // Creating instance of model useing perticular keys
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    console.log(user);
    res.send("wooohoo....Profile Created ");
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

// API -- Login user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("invalid email");

    // creating JWT Token and push user id as secret data
    const token = jwt.sign({ _id: user._id }, "rahul");

    // checking whether password is correct or not and....
    // sending jwt token in a cookie attached with responce
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.cookie("token", token);
      res.send("Login successful!");
    } else {
      res.send("p - invalid credential");
    }
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

// API -- USER profile

app.get("/profile", UserAuth, async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("login first");
    }
    const decodetoken = await jwt.verify(token, "rahul");

    const userProfile = await User.findOne({ _id: decodetoken._id });
    if (!userProfile) {
      throw new Error("invalid user");
    }
    res.send(userProfile);
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

// API -- feed api to see all the users in DB
app.get("/feed", UserAuth, async (req, res) => {
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
