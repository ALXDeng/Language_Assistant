require("dotenv").config();
const OpenAI = require("openai");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

async function pollRunStatus(threadId, runId) {
  const maxAttempts = 15;
  const pollingInterval = 1000; // 2 seconds
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
      );
      if (runStatus.status === "completed") {
        // console.log(attempts);
        return runStatus;
      } else if (runStatus.status === "failed") {
        // console.log(attempts);
        throw new Error("Run failed");
      } else if (runStatus.status === "cancelled") {
        // console.log(attempts);
        throw new Error("Run cancelled");
      }
    } catch (error) {
      console.error(`Error polling run status: ${error.message}`);
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    attempts++;
  }
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  throw new Error("Max polling attempts reached");
}
async function executeThread(threadId, role, content, assistantId) {
  try {
    // Create a message in the thread
    await openai.beta.threads.messages.create(threadId, {
      role: role,
      content: content,
    });

    // Start the run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Poll for the run status
    const runStatus = await pollRunStatus(threadId, run.id, assistantId);
    console.log("Run completed successfully");
    run_id = run.id;
    return { runStatus, run_id };
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    throw error; // Re-throw the error to handle it outside the function
  }
}

const createMessage = async (req, res) => {
  const { role, content, chat_id } = req.body;
  const user_id = req.user._id;
  const chat = await Chat.findById(chat_id);
  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  thread_id = chat.thread_id;
  assistant_id = chat.assistant_id;

  //adding a message to the thread
  try {
    executeThread(thread_id, role, content, assistant_id)
      .then(async ({ runStatus, run_id }) => {
        // get the latest message from the thread
        const messages = await openai.beta.threads.messages.list(thread_id);

        let lastMessage = messages.data
          .filter(
            (message) =>
              message.run_id === run_id && message.role === "assistant"
          )
          .pop();
        lastMessage = lastMessage.content[0].text.value;

        if (!lastMessage) {
          return res.status(404).json({ error: "Assistant message not found" });
        }

        // Create a message document from this message
        const message = await Message.create({ role, content });
        if (!message) {
          return res.status(400).json({ error: "Something went wrong" });
        }
        message_assistant = await Message.create({
          role: "assistant",
          content: lastMessage,
        });

        // Add the messages to the chat
        chat.messages.push(message);
        chat.messages.push(message_assistant);
        await chat.save();
        //return the entire chat back to the frontend
        res.status(200).json({ latest_message: message_assistant });
      })
      .catch((error) => {
        console.error(`An error occurred: ${error.message}`);
        res.status(400).json({ error: error.message });
      });
  } catch (err) {
    res.status(400).json({ error: err });
  }

  await chat.save();
};

module.exports = {
  createMessage,
};
