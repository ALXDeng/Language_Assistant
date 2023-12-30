const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const createMessage = async (req, res) => {
  const { role, content, chat_id } = req.body;
  const user_id = req.user._id;
  const message = await Message.create({ role, content });
  if (!message) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  const chat = await Chat.findById(chat_id);
  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }
  chat.messages.push(message);

  //Use OpenAI API to Generate A Response

  await chat.save();
};
