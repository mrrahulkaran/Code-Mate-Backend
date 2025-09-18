const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest.js");
const { UserAuth } = require("../Middelwares/auth.js");
const User = require("../model/user.js");
userRouter.use(express.json());

// API - delete a user by emailId + cascade delete connection requests
userRouter.delete("/user/:emailId", async (req, res) => {
  const emailId = req.params.emailId;

  const emailIDExists = await User.findOne({ emailId: emailId });
  if (!emailIDExists) return res.status(400).send("Email Not Exist");

  try {
    // Delete user
    await User.findOneAndDelete({ emailId: emailId });

    // Delete connection requests referencing that user
    await ConnectionRequest.deleteMany({
      $or: [{ senderId: emailIDExists._id }, { reciverId: emailIDExists._id }],
    });

    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// API - update a user
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

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });

    res.send("user updated successfully");
  } catch (Error) {
    res.status(400).send("something went wrong" + Error);
  }
});

// API - get all pending connection requests received by logged-in user (filtered)
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

    // Filter out requests with null senderId
    const filteredConnections = connections.filter(
      (conn) => conn.senderId !== null
    );

    res.json({ data: filteredConnections });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

// API - get all accepted connections of logged-in user (filtered)
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

    // Filter out records where senderId or reciverId is null
    const filteredConnectionsReq = connectionsReq.filter(
      (row) => row.senderId !== null && row.reciverId !== null
    );

    const data = filteredConnectionsReq.map((row) => {
      if (row.senderId._id.toString() === loginuser._id.toString()) {
        return row.reciverId;
      }
      return row.senderId;
    });

    res.json({ message: "Data fetched Successfully", data });
  } catch (error) {
    res.status(400).send("Opps: " + error.message);
  }
});

userRouter.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "firstName lastName email"); // select needed fields
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = userRouter;
