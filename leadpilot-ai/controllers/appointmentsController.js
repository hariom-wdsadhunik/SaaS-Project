const repository = require("../db");

// Get all appointments with filters
exports.getAppointments = async (req, res) => {
  try {
    const data = await repository.getAppointments(req.query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repository.getAppointmentById(id);

    if (!data) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ error: "Appointment not found" });
  }
};

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const data = await repository.createAppointment(appointmentData);

    // Add note about appointment
    if (appointmentData.lead_id) {
      await repository.createNote({
        lead_id: appointmentData.lead_id,
        note_type: "System",
        content: `Appointment scheduled: ${appointmentData.title} on ${new Date(appointmentData.scheduled_at || Date.now()).toLocaleString()}`
      });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const data = await repository.updateAppointment(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// Complete appointment with feedback
exports.completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, rating, notes } = req.body;

    const updates = {
      status: "Completed",
      feedback,
      rating,
      notes,
      updated_at: new Date().toISOString()
    };

    const data = await repository.updateAppointment(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Add completion note
    if (data.lead_id) {
      await repository.createNote({
        lead_id: data.lead_id,
        note_type: "Site Visit",
        content: `Site visit completed. Feedback: ${feedback || "No feedback provided"}`
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error completing appointment:", err);
    res.status(500).json({ error: "Failed to complete appointment" });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updates = {
      status: "Cancelled",
      notes: reason,
      updated_at: new Date().toISOString()
    };

    const data = await repository.updateAppointment(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await repository.deleteAppointment(id);

    if (!success) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const response = await repository.getAppointments(req.query);
    const appointmentsList = Array.isArray(response) ? response : (response?.data || []);
    const now = new Date();
    const upcoming = appointmentsList
      .filter(a => new Date(a.scheduled_at) >= now && ["Scheduled", "Rescheduled"].includes(a.status))
      .slice(0, 10);

    res.json(upcoming);
  } catch (err) {
    console.error("Error fetching upcoming appointments:", err);
    res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
};

// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
  try {
    const stats = await repository.getAppointmentStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching appointment stats:", err);
    res.status(500).json({ error: "Failed to fetch appointment stats" });
  }
};
