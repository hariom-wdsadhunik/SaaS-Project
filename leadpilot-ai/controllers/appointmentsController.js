const supabase = require("../db/supabase");

// Get all appointments with filters
exports.getAppointments = async (req, res) => {
  try {
    const { lead_id, property_id, status, from_date, to_date, assigned_to } = req.query;
    
    let query = supabase
      .from("appointments")
      .select("*, leads(phone, message), properties(title, address)")
      .order("scheduled_at", { ascending: true });
    
    if (lead_id) query = query.eq("lead_id", lead_id);
    if (property_id) query = query.eq("property_id", property_id);
    if (status) query = query.eq("status", status);
    if (assigned_to) query = query.eq("assigned_to", assigned_to);
    if (from_date) query = query.gte("scheduled_at", from_date);
    if (to_date) query = query.lte("scheduled_at", to_date);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("appointments")
      .select("*, leads(*), properties(*)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Appointment not found" });
  }
};

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    
    const { data, error } = await supabase
      .from("appointments")
      .insert([appointmentData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Add note about appointment
    await supabase.from("notes").insert([{
      lead_id: appointmentData.lead_id,
      note_type: "System",
      content: `Appointment scheduled: ${appointmentData.title} on ${new Date(appointmentData.scheduled_at).toLocaleString()}`
    }]);
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// Complete appointment with feedback
exports.completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, rating, notes } = req.body;
    
    const { data, error } = await supabase
      .from("appointments")
      .update({
        status: "Completed",
        feedback,
        rating,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add completion note
    await supabase.from("notes").insert([{
      lead_id: data.lead_id,
      note_type: "Site Visit",
      content: `Site visit completed. Feedback: ${feedback || "No feedback provided"}`
    }]);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to complete appointment" });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const { data, error } = await supabase
      .from("appointments")
      .update({
        status: "Cancelled",
        notes: reason,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const { assigned_to } = req.query;
    
    let query = supabase
      .from("appointments")
      .select("*, leads(phone, message), properties(title)")
      .gte("scheduled_at", new Date().toISOString())
      .in("status", ["Scheduled", "Rescheduled"])
      .order("scheduled_at", { ascending: true })
      .limit(10);
    
    if (assigned_to) query = query.eq("assigned_to", assigned_to);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
};

// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    
    const { data: todayCount, error: err1 } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .gte("scheduled_at", today)
      .lt("scheduled_at", today + 'T23:59:59');
    
    const { data: monthCount, error: err2 } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .gte("scheduled_at", startOfMonth);
    
    const { data: completed, error: err3 } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("status", "Completed");
    
    const { data: noShow, error: err4 } = await supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("status", "No Show");
    
    if (err1 || err2 || err3 || err4) throw err1 || err2 || err3 || err4;
    
    res.json({
      today: todayCount.length,
      thisMonth: monthCount.length,
      completed: completed.length,
      noShow: noShow.length
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointment stats" });
  }
};
