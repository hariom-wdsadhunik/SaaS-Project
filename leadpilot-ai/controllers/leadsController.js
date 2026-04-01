const { supabase } = require("../db/supabase");

// Get all leads with pagination and filters
exports.getLeads = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    
    let query = supabase
      .from("leads")
      .select("*, properties(*), deals(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(`phone.ilike.%${search}%,message.ilike.%${search}%,location.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    res.json({
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ error: "Failed to fetch leads", details: err.message });
  }
};

// Get single lead with all related data
exports.getSingleLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        properties(*),
        deals(*),
        appointments(*),
        tasks(*),
        notes(*),
        documents(*)
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Lead not found" });
    
    res.json(data);
  } catch (err) {
    console.error("Error fetching lead:", err);
    res.status(500).json({ error: "Failed to fetch lead", details: err.message });
  }
};

// Create new lead
exports.createLead = async (req, res) => {
  try {
    const leadData = req.body;
    
    // Add metadata
    leadData.created_by = req.user.id;
    leadData.team_id = req.user.team_id;
    leadData.created_at = new Date().toISOString();
    leadData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("leads")
      .insert([leadData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Log activity
    await supabase.from("activity_logs").insert([{
      user_id: req.user.id,
      team_id: req.user.team_id,
      action: "lead_created",
      description: `Created lead ${data.phone}`,
      metadata: { lead_id: data.id }
    }]);
    
    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ error: "Failed to create lead", details: err.message });
  }
};

// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...updates } = req.body;
    
    updates.updated_at = new Date().toISOString();
    if (status) updates.status = status;
    
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Lead not found" });
    
    // Log activity
    await supabase.from("activity_logs").insert([{
      user_id: req.user.id,
      team_id: req.user.team_id,
      action: "lead_updated",
      description: `Updated lead ${data.phone} status to ${status}`,
      metadata: { lead_id: id, status }
    }]);
    
    res.json(data);
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ error: "Failed to update lead", details: err.message });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ error: "Failed to delete lead", details: err.message });
  }
};
