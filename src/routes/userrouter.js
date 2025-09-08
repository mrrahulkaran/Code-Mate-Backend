const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest.js");
const { UserAuth } = require("../Middelwares/auth.js");
const User = require("../model/user.js");
userRouter.use(express.json());

//API -delete a user by emailId
userRouter.delete("/user/:emailId", async (req, res) => {
  const emailId = req.params.emailId; // ensure req.body is parsed
  console.log(emailId); // just log the variable

  const emailIDExists = await User.findOne({ emailId: emailId });
  if (!emailIDExists) return res.status(400).send("Email Not Exist");

  try {
    await User.findOneAndDelete({ emailId: emailId });
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// API- update a user
userRouter.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
      "lastName",
      "Password",
      "photoUrl",
      "about",
      "age",
      "gender",
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

// API - get all pending connection request for logged in user
userRouter.get("/user/request/recived", UserAuth, async (req, res) => {
  const loginuser = req.user;
  try {
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
      "skills",
    ];
    const connections = await ConnectionRequest.find({
      reciverId: loginuser._id,
      status: "intrested",
    }).populate("senderId", USER_SAFE_DATA);
    res.json({ data: connections });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});
// api to get all connections of login user
userRouter.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const loginuser = req.user;
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "skills",
    ];

    const connectionsReq = await ConnectionRequest.find({
      $or: [
        { senderId: loginuser._id, status: "accsepted" },
        { reciverId: loginuser._id, status: "accsepted" },
      ],
    })
      .populate("senderId", USER_SAFE_DATA)
      .populate("reciverId", USER_SAFE_DATA);

    const data = connectionsReq.map((row) => {
      if (row.senderId._id.toString() === loginuser._id.toString()) {
        return row.receverId;
      }
      return row.senderId;
    });

    res.json({ message: "Data fetched Succsessfully ", data });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

module.exports = userRouter;
