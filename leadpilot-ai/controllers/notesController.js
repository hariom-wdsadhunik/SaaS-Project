const { supabase } = require("../db/supabase");

// Get all notes for a lead
exports.getNotes = async (req, res) => {
  try {
    const { lead_id, property_id, note_type } = req.query;
    
    let query = supabase
      .from("notes")
      .select("*, users(name)")
      .order("created_at", { ascending: false });
    
    if (lead_id) query = query.eq("lead_id", lead_id);
    if (property_id) query = query.eq("property_id", property_id);
    if (note_type) query = query.eq("note_type", note_type);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("notes")
      .select("*, users(name), leads(phone)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Note not found" });
  }
};

// Create note
exports.createNote = async (req, res) => {
  try {
    const noteData = req.body;
    
    const { data, error } = await supabase
      .from("notes")
      .insert([noteData])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

// Create call log
exports.createCallLog = async (req, res) => {
  try {
    const { lead_id, content, call_duration, call_outcome, sentiment, created_by } = req.body;
    
    const { data, error } = await supabase
      .from("notes")
      .insert([{
        lead_id,
        note_type: "Call",
        content,
        call_duration,
        call_outcome,
        sentiment,
        created_by
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update lead status to contacted if it's a new lead
    const { data: lead } = await supabase
      .from("leads")
      .select("status")
      .eq("id", lead_id)
      .single();
    
    if (lead && lead.status === "new") {
      await supabase
        .from("leads")
        .update({ status: "contacted", updated_at: new Date().toISOString() })
        .eq("id", lead_id);
    }
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create call log" });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};

// Get communication timeline for a lead
exports.getCommunicationTimeline = async (req, res) => {
  try {
    const { lead_id } = req.params;
    
    // Get notes
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("*, users(name)")
      .eq("lead_id", lead_id)
      .order("created_at", { ascending: false });
    
    // Get appointments
    const { data: appointments, error: apptError } = await supabase
      .from("appointments")
      .select("*, properties(title)")
      .eq("lead_id", lead_id)
      .order("scheduled_at", { ascending: false });
    
    // Get tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("lead_id", lead_id)
      .order("created_at", { ascending: false });
    
    if (notesError || apptError || tasksError) throw notesError || apptError || tasksError;
    
    // Combine and sort timeline
    const timeline = [
      ...notes.map(n => ({ ...n, type: 'note', date: n.created_at })),
      ...appointments.map(a => ({ ...a, type: 'appointment', date: a.scheduled_at })),
      ...tasks.map(t => ({ ...t, type: 'task', date: t.created_at }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(timeline);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch communication timeline" });
  }
};
