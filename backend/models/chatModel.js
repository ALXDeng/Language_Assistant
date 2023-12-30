const mongoose = require("mongoose");
const Message = require("./messageModel");

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    user_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
