const amqplib = require("amqplib");

let channel = null;
let connection = null;

async function connectRabbitMQ(retries = 5, delay = 3000) {
  while (retries) {
    try {
      connection = await amqplib.connect("amqp://rabbitmq_node");
      channel = await connection.createChannel();
      await channel.assertQueue("task_created");
      console.log("Connected to RabbitMQ");
      return channel;
    } catch (error) {
      console.error("RabbitMQ connection error:", error.message);
      retries -= 1;
      console.log(`Retrying in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Failed to connect to RabbitMQ");
}

function getChannel() {
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
