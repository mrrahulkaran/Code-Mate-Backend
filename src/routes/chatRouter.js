// routes/chatrouter.js
const express = require("express");
const chatRouter = express.Router();
const { UserAuth } = require("../Middelwares/auth");
const Chat = require("../model/chat");

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    const chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
      .populate("messages.senderId", "firstName lastName")
      .exec();

    if (!chat) {
      return res.json({ messages: [] });
    }

    const messages = chat.messages.map((msg) => ({
      senderId: msg.senderId._id,
      firstName: msg.senderId.firstName,
      lastName: msg.senderId.lastName,
      text: msg.text,
      createdAt: msg.createdAt,
    }));

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = chatRouter;
