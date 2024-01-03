const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
//express app
const app = express();
workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
//middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(express.json());
//routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chats/messages", messageRoutes);

//connect to mongodb

mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("listening for requests on port 4000!!!");
    });
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
