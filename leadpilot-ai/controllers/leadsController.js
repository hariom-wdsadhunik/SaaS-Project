const repository = require("../db");

// Get all leads with pagination and filters
exports.getLeads = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    const result = await repository.getLeads({
      status,
      search,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      data: result.data,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10)
      }
    });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// Get single lead with all related data
exports.getSingleLead = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await repository.getLeadById(id);

    if (!data) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching lead:", err);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
};

// Create new lead
exports.createLead = async (req, res) => {
  try {
    const leadData = { ...req.body };

    // Add metadata
    if (req.user) {
      leadData.created_by = req.user.id;
      leadData.team_id = req.user.team_id;
    }
    leadData.created_at = new Date().toISOString();
    leadData.updated_at = new Date().toISOString();

    const data = await repository.createLead(leadData);

    // Log activity via repository
    if (req.user?.id) {
      await repository.logActivity({
        user_id: req.user.id,
        team_id: req.user.team_id,
        action: "lead_created",
        description: `Created lead ${data.phone || data.name}`,
        metadata: { lead_id: data.id }
      });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ error: "Failed to create lead" });
  }
};

// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...updates } = req.body;

    const leadUpdates = { ...updates, updated_at: new Date().toISOString() };
    if (status) leadUpdates.status = status;

    const data = await repository.updateLead(id, leadUpdates);

    if (!data) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Log activity via repository
    if (req.user?.id) {
      await repository.logActivity({
        user_id: req.user.id,
        team_id: req.user.team_id,
        action: "lead_updated",
        description: `Updated lead ${data.phone || data.name} status to ${status || data.status}`,
        metadata: { lead_id: id, status: status || data.status }
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ error: "Failed to update lead" });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await repository.deleteLead(id);

    if (!success) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ error: "Failed to delete lead" });
  }
};
