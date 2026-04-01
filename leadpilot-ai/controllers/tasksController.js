const { supabase } = require("../db/supabase");

// Get all tasks with filters
exports.getTasks = async (req, res) => {
  try {
    const { lead_id, assigned_to, status, priority, due_before, due_after } = req.query;
    
    let query = supabase
      .from("tasks")
      .select("*, leads(phone, message)")
      .order("due_date", { ascending: true });
    
    if (lead_id) query = query.eq("lead_id", lead_id);
    if (assigned_to) query = query.eq("assigned_to", assigned_to);
    if (status) query = query.eq("status", status);
    if (priority) query = query.eq("priority", priority);
    if (due_before) query = query.lte("due_date", due_before);
    if (due_after) query = query.gte("due_date", due_after);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*, leads(*), properties(*)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Task not found" });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    
    const { data, error } = await supabase
      .from("tasks")
      .insert([taskData])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Complete task
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: "Completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add completion note
    await supabase.from("notes").insert([{
      lead_id: data.lead_id,
      note_type: "System",
      content: `Task completed: ${data.title}`
    }]);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to complete task" });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Get overdue tasks
exports.getOverdueTasks = async (req, res) => {
  try {
    const { assigned_to } = req.query;
    const now = new Date().toISOString();
    
    let query = supabase
      .from("tasks")
      .select("*, leads(phone, message)")
      .lt("due_date", now)
      .eq("status", "Pending")
      .order("due_date", { ascending: true });
    
    if (assigned_to) query = query.eq("assigned_to", assigned_to);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overdue tasks" });
  }
};

// Get today's tasks
exports.getTodayTasks = async (req, res) => {
  try {
    const { assigned_to } = req.query;
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
      .from("tasks")
      .select("*, leads(phone, message)")
      .gte("due_date", today)
      .lt("due_date", today + 'T23:59:59')
      .in("status", ["Pending", "In Progress"])
      .order("priority", { ascending: false });
    
    if (assigned_to) query = query.eq("assigned_to", assigned_to);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today's tasks" });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const { assigned_to } = req.query;
    
    let pendingQuery = supabase.from("tasks").select("id", { count: "exact" }).eq("status", "Pending");
    let completedQuery = supabase.from("tasks").select("id", { count: "exact" }).eq("status", "Completed");
    let overdueQuery = supabase.from("tasks").select("id", { count: "exact" }).lt("due_date", new Date().toISOString()).eq("status", "Pending");
    
    if (assigned_to) {
      pendingQuery = pendingQuery.eq("assigned_to", assigned_to);
      completedQuery = completedQuery.eq("assigned_to", assigned_to);
      overdueQuery = overdueQuery.eq("assigned_to", assigned_to);
    }
    
    const [{ data: pending }, { data: completed }, { data: overdue }] = await Promise.all([
      pendingQuery,
      completedQuery,
      overdueQuery
    ]);
    
    res.json({
      pending: pending.length,
      completed: completed.length,
      overdue: overdue.length,
      completionRate: pending.length + completed.length > 0 
        ? Math.round((completed.length / (pending.length + completed.length)) * 100) 
        : 0
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch task stats" });
  }
};
