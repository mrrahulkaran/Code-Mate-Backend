const socket = require("socket.io");
const mongoose = require("mongoose");
const Chat = require("../model/chat"); //  chat model

const getRoomId = (participants) => {
  return participants.sort().join("_");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: process.env.ORIGIN, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userIds, chatId }) => {
      if (chatId) {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat: ${chatId}`);
      } else if (userIds && userIds.length > 1) {
        const room = getRoomId(userIds);
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      }
    });

    socket.on(
      "sendMessage",
      async ({ senderId, recipientId, chatId, text }) => {
        try {
          let chat;
          if (chatId) {
            chat = await Chat.findById(chatId);
          } else {
            const participantIds = [senderId, recipientId].sort();
            chat = await Chat.findOne({ participants: participantIds });
            if (!chat) {
              chat = new Chat({ participants: participantIds });
              await chat.save();
            }
          }

          chat.messages.push({ senderId, text });
          await chat.save();

          const room = chatId || getRoomId([senderId, recipientId]);
          io.to(room).emit("messageReceived", {
            senderId,
            text,
            createdAt: new Date(),
          });
        } catch (err) {
          console.error("Error in sendMessage:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
