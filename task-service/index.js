const express = require("express");
const mongoose = require("mongoose");
const amqplib = require("amqplib");
const taskRoutes = require("./src/routes/taskRoutes");
const { connectRabbitMQ } = require("./rabbitMQ");
require("dotenv").config();

const app = express();
const PORT = 3002;

app.use(express.json());

app.use("/tasks", taskRoutes);

// MongoDB Atlas connection
mongoose
  .connect("mongodb://mongo:27017/tasks")
  .then(() => console.log("Connected to Local MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Task Service is running");
});

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
  connectRabbitMQ();
});
