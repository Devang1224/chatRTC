const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
      }
    ],
    lastMessage: {
      type:String,
      default:""
    },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model("Conversation", ConversationSchema);
