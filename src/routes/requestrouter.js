const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const { UserAuth } = require("../Middelwares/auth.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      console.log(status);

      ALLOWED_STATUS = ["intrested", "ignored"];
      console.log(!ALLOWED_STATUS.includes(status));

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Status is invalid");
      }

      const isconnectionpresent = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (isconnectionpresent) {
        throw new Error("Request Already exist");
      }

      const connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connection.save();

      res.send(" Send a connection Request");
    } catch (error) {
      res.status(400).send("Opps: " + error.message);
    }
  }
);
module.exports = requestRouter;
