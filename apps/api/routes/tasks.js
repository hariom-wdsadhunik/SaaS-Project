const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { createTaskSchema, updateTaskSchema } = require("../schemas/taskSchemas");
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
router.post("/", validate(createTaskSchema), createTask);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

module.exports = router;
