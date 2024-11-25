const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const { UserAuth } = require("../Middelwares/auth.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const reciverId = req.params.toUserId;
      const status = req.params.status;
      console.log(status);

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

module.exports = requestRouter;
