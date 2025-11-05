const express = require("express");
const router = express.Router();
const { getAllTasks, createTask, updateTask, deleteTask } = require("../contollers/taskController");

router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
