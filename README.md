
---

# 🐇 RabbitMQ Integration in Task & Notification Services

## 📘 Overview

This project demonstrates how to use **RabbitMQ** as a message broker for communication between microservices — specifically between a **Task Service** and a **Notification Service**.

Instead of directly calling each other, services communicate **asynchronously** through RabbitMQ queues.
This improves **reliability**, **scalability**, and **decoupling** between services.

---

## 🧩 Architecture

```
      +--------------------+
      |    Task Service    |
      |--------------------|
      | 1. Create new task |
      | 2. Send message →  |
      +---------|----------+
                |
                v
    +------------------------+
    |      RabbitMQ Queue    |
    |------------------------|
    |   "task_created"       |
    +---------|--------------+
              |
              v
    +--------------------------+
    |   Notification Service   |
    |--------------------------|
    | 1. Receive message       |
    | 2. Process notification  |
    |  (e.g., log/email)       |
    +--------------------------+
```

---

## ⚙️ How It Works

### 🧱 1. Task Service

* Handles **task creation** and stores it in MongoDB.
* After saving a task, it sends a message to RabbitMQ’s `task_created` queue.

```js
const message = {
  taskId: newTask._id,
  title: newTask.title,
  status: newTask.status,
};

const channel = getChannel();
channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
```

---

### 🔔 2. Notification Service

* Listens to the `task_created` queue.
* Whenever a new message arrives, it processes it (e.g., logs or sends email).

```js
channel.consume("task_created", (msg) => {
  const task = JSON.parse(msg.content.toString());
  console.log("📢 New task created:", task.title);
  channel.ack(msg);
});
```

---

## 🛠 Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

---

### 2. Install Dependencies

For each service:

```bash
cd task-service
npm install

cd ../notification-service
npm install
```

---

### 3. Start RabbitMQ with Docker

Make sure Docker is running, then execute:

```bash
docker run -d --hostname rabbitmq_node \
  --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```

* RabbitMQ Management UI → [http://localhost:15672](http://localhost:15672)
  **Username:** `guest`
  **Password:** `guest`

---

### 4. Run All Services via Docker Compose

A `docker-compose.yml` file is provided to orchestrate all services:

```yaml
services:
  user-service:
    build:
      context: ./user-service
    container_name: user-service
    ports:
      - "3003:3003"
    depends_on:
      - mongo
    environment:
      - MONGO_URI=mongodb://mongo:27017/users

  task-service:
    build:
      context: ./task-service
    container_name: task-service
    ports:
      - "3002:3002"
    depends_on:
      - mongo
      - rabbitmq
    environment:
      - MONGO_URI=mongodb://mongo:27017/tasks

  notification-service:
    build:
      context: ./notification-service
    container_name: notification-service
    ports:
      - "3001:3001"
    depends_on:
      - mongo
      - rabbitmq

  mongo:
    image: mongo:5
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq_node
    ports:
      - "15672:15672"
      - "5672:5672"

volumes:
  mongo-data:
```

Then start everything with:

```bash
docker-compose up -d
```

---

## ▶️ Example Flow

1. **Create a new task** using Postman or curl:

   ```bash
   POST http://localhost:3002/tasks
   Content-Type: application/json

   {
     "title": "Finish project report",
     "description": "Prepare the final draft"
   }
   ```

2. The **Task Service** saves the task and sends a message → `RabbitMQ`.

3. The **Notification Service** receives the message and logs:

   ```
   📢 New task created: Finish project report
   ```

---

## 🚀 Benefits of Using RabbitMQ

| Benefit          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| **Decoupling**   | Services don’t depend directly on each other.        |
| **Reliability**  | Messages are stored safely until processed.          |
| **Scalability**  | Multiple consumers can process messages in parallel. |
| **Asynchronous** | Enables background processing without blocking API.  |

---

## 🧠 Key Concepts

| Term         | Meaning                                                               |
| ------------ | --------------------------------------------------------------------- |
| **Producer** | The service that sends messages (Task Service).                       |
| **Consumer** | The service that receives messages (Notification Service).            |
| **Queue**    | Temporary storage where messages wait to be processed.                |
| **Exchange** | Routes messages to the correct queue (not used in this simple setup). |

---



