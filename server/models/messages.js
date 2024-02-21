const mongoose = require("mongoose");

const messages = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    senderImage: {
        type:String
    },
    text: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messages);
