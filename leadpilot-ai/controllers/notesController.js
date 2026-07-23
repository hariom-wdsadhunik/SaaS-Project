const repository = require("../db");

// Get all notes for a lead
exports.getNotes = async (req, res) => {
  try {
    const data = await repository.getNotes(req.query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repository.getNoteById(id);

    if (!data) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ error: "Note not found" });
  }
};

// Create note
exports.createNote = async (req, res) => {
  try {
    const noteData = req.body;
    const data = await repository.createNote(noteData);

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

// Create call log
exports.createCallLog = async (req, res) => {
  try {
    const { lead_id, content, call_duration, call_outcome, sentiment, created_by } = req.body;

    const data = await repository.createNote({
      lead_id,
      note_type: "Call",
      content,
      call_duration,
      call_outcome,
      sentiment,
      created_by
    });

    // Update lead status to contacted if it's a new lead
    if (lead_id) {
      const lead = await repository.getLeadById(lead_id);
      if (lead && lead.status === "new") {
        await repository.updateLead(lead_id, { status: "contacted" });
      }
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating call log:", err);
    res.status(500).json({ error: "Failed to create call log" });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const data = await repository.updateNote(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await repository.deleteNote(id);

    if (!success) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

// Get communication timeline for a lead
exports.getCommunicationTimeline = async (req, res) => {
  try {
    const { lead_id } = req.params;

    const notesRes = await repository.getNotes({ lead_id });
    const appointmentsRes = await repository.getAppointments({ lead_id });
    const tasksRes = await repository.getTasks({ lead_id });

    const notesList = Array.isArray(notesRes) ? notesRes : (notesRes?.data || []);
    const appointmentsList = Array.isArray(appointmentsRes) ? appointmentsRes : (appointmentsRes?.data || []);
    const tasksList = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data || []);

    // Combine and sort timeline
    const timeline = [
      ...notesList.map(n => ({ ...n, type: 'note', date: n.created_at })),
      ...appointmentsList.map(a => ({ ...a, type: 'appointment', date: a.scheduled_at })),
      ...tasksList.map(t => ({ ...t, type: 'task', date: t.created_at }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(timeline);
  } catch (err) {
    console.error("Error fetching communication timeline:", err);
    res.status(500).json({ error: "Failed to fetch communication timeline" });
  }
};
