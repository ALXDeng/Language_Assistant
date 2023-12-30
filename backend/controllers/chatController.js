const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const getChats = async (req, res) => {
  const user_id = req.user._id;
  const chats = await Chat.find({ user_id }).sort({ createdAt: -1 });
  res.status(200).json(chats);
};

const createChat = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    title = "New Lesson";
  }

  // if (emptyFields.length > 0) {
  //     return res
  //         .status(400)
  //         .json({ error: "Please fill in all fields", emptyFields });
  // }
  try {
    const user_id = req.user._id;
    const chat = await Chat.create({ title, user_id });
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteChat = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Chat not found" });
  }
  const chat = await Chat.findOneAndDelete({ _id: id });
  res.status(200).json(chat);
};

const getChatMessages = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Chat not found" });
  }
  const chat = await Chat.findById(id).populate("messages");
  res.status(200).json(chat);
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
};
