const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  getOverdueTasks,
  getTodayTasks,
  getTaskStats
} = require("../controllers/tasksController");

// Task routes
router.get("/", getTasks);
router.get("/overdue/list", getOverdueTasks);
router.get("/today/list", getTodayTasks);
router.get("/stats/overview", getTaskStats);
router.get("/:id", getTask);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

module.exports = router;
