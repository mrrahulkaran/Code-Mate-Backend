const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest.js");
const { UserAuth } = require("../Middelwares/auth.js");

//api to send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const reciverId = req.params.toUserId;
      const status = req.params.status;

      if (senderId.toString() === reciverId.toString()) {
        throw new Error("You can not send request to yourself");
      }
      ALLOWED_STATUS = ["intrested", "ignored"];
      console.log(!ALLOWED_STATUS.includes(status));

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Status is invalid");
      }

      const isconnectionpresent = await ConnectionRequest.findOne({
        $or: [
          { senderId, reciverId },
          {
            senderId: reciverId,
            reciverId: senderId,
          },
        ],
      });

      if (isconnectionpresent) {
        throw new Error("Request Already exist");
      }

      const connection = new ConnectionRequest({
        senderId,
        reciverId,
        status,
      });

      await connection.save();

      res.send(" Send a connection Request");
    } catch (error) {
      res.status(400).send("Opps: " + error.message);
    }
  }
);

//api to review connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;

      const loginuserId = req.user._id;

      ALLOWED_STATUS = ["accsepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Status not allowed");
      }

      const isconnectionpresent = await ConnectionRequest.findOne({
        _id: requestId,
        reciverId: loginuserId,
        status: "intrested",
      });

      if (!isconnectionpresent) {
        throw new Error("request not found");
      }

      isconnectionpresent.status = status;
      const data = await isconnectionpresent.save();

      res.json({ message: "request " + status, data });
    } catch (error) {
      res.status(400).send("Opps: " + error.message);
    }
  }
);

// Get all "intrested" connection requests received by logged in user
requestRouter.get("/request/received", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user

    // Find all requests where logged-in user is the receiver and status is "intrested"
    const receivedRequests = await ConnectionRequest.find({
      reciverId: userId,
      status: "intrested",
    }).populate("senderId", "firstName lastName email photoUrl"); // optional: populate sender info

    res.json(receivedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch received requests" });
  }
});

module.exports = requestRouter;
