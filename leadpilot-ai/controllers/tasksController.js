const repository = require("../db");

// Get all tasks with filters
exports.getTasks = async (req, res) => {
  try {
    const data = await repository.getTasks(req.query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repository.getTaskById(id);

    if (!data) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ error: "Task not found" });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const data = await repository.createTask(taskData);

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const data = await repository.updateTask(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Complete task
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      status: "Completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const data = await repository.updateTask(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (data.lead_id) {
      await repository.createNote({
        lead_id: data.lead_id,
        note_type: "System",
        content: `Task completed: ${data.title}`
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error completing task:", err);
    res.status(500).json({ error: "Failed to complete task" });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await repository.deleteTask(id);

    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Get overdue tasks
exports.getOverdueTasks = async (req, res) => {
  try {
    const allTasks = await repository.getTasks(req.query);
    const now = new Date();
    const overdue = (allTasks || []).filter(t => new Date(t.due_date) < now && t.status === "Pending");
    res.json(overdue);
  } catch (err) {
    console.error("Error fetching overdue tasks:", err);
    res.status(500).json({ error: "Failed to fetch overdue tasks" });
  }
};

// Get today's tasks
exports.getTodayTasks = async (req, res) => {
  try {
    const tasks = await repository.getTodayTasks();
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching today's tasks:", err);
    res.status(500).json({ error: "Failed to fetch today's tasks" });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const stats = await repository.getTaskStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching task stats:", err);
    res.status(500).json({ error: "Failed to fetch task stats" });
  }
};
