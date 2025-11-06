const amqplib = require("amqplib");

async function start() {
  try {
    connection = await amqplib.connect("amqp://rabbitmq_node");
    channel = await connection.createChannel();
    await channel.assertQueue("task_created");
    console.log("NotificationService Connected to RabbitMQ");
    channel.consume("task_created", (msg) => {
      const task = JSON.parse(msg.content.toString());
      console.log("New task created:", task.title);
      console.log("New task created:", task);
      channel.ack(msg);
    });
  } catch (error) {
    console.error("RabbitMQ connection error:", error.message);
  }
}

start();
