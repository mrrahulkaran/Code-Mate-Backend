const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // creating referance to user model
      required: true,
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accsepted", "rejected"],
        massage: "`{VALUE} is incorrect Status Type`",
      },
    },
  },
  { timestamps: true }
);
//compound indexing
connectionRequestSchema.index({ senderId: 1, reciverId: 1 }, { unique: true });

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
