const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // to track who read the message
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
      default: null,
    },
    groupImage: {
      type: String, // URL or path to group image
      default: null,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps to the chat itself
  }
);

// Index participants for efficient querying of existing chats
chatSchema.index({ participants: 1 });

// Helper method to add a message
chatSchema.methods.addMessage = function (senderId, text) {
  this.messages.push({ senderId, text });
  return this.save();
};

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
