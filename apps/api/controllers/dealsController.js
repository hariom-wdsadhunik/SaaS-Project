const repository = require("../db");

// Get all deals with filters
exports.getDeals = async (req, res) => {
  try {
    const data = await repository.getDeals(req.query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching deals:", err);
    res.status(500).json({ error: "Failed to fetch deals" });
  }
};

// Get single deal
exports.getDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repository.getDealById(id);

    if (!data) {
      return res.status(404).json({ error: "Deal not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching deal:", err);
    res.status(500).json({ error: "Deal not found" });
  }
};

// Create deal
exports.createDeal = async (req, res) => {
  try {
    const dealData = { ...req.body };

    // Calculate commission amount
    if (dealData.deal_value && dealData.commission_percentage) {
      dealData.commission_amount = (parseFloat(dealData.deal_value) * parseFloat(dealData.commission_percentage)) / 100;
    }

    const data = await repository.createDeal(dealData);

    // Update lead status to closed
    if (dealData.lead_id) {
      await repository.updateLead(dealData.lead_id, { status: "closed" });
    }

    // Add note about deal creation
    if (dealData.lead_id) {
      await repository.createNote({
        lead_id: dealData.lead_id,
        note_type: "System",
        content: `Deal created: Value ${dealData.deal_value || 0}, Commission ${dealData.commission_amount || 0}`
      });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating deal:", err);
    res.status(500).json({ error: "Failed to create deal" });
  }
};

// Update deal
exports.updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    // Recalculate commission if value or percentage changed
    if (updates.deal_value || updates.commission_percentage) {
      const current = await repository.getDealById(id);
      if (current) {
        const value = parseFloat(updates.deal_value) || parseFloat(current.deal_value) || 0;
        const percentage = parseFloat(updates.commission_percentage) || parseFloat(current.commission_percentage) || 0;
        updates.commission_amount = (value * percentage) / 100;
      }
    }

    const data = await repository.updateDeal(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Deal not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating deal:", err);
    res.status(500).json({ error: "Failed to update deal" });
  }
};

// Close deal (won)
exports.closeDealWon = async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_close_date, notes } = req.body;

    const updates = {
      deal_stage: "Closed Won",
      actual_close_date: actual_close_date || new Date().toISOString().split('T')[0],
      notes,
      updated_at: new Date().toISOString()
    };

    const data = await repository.updateDeal(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Deal not found" });
    }

    // Update property status to sold
    if (data.property_id) {
      await repository.updateProperty(data.property_id, { status: "Sold" });
    }

    // Add celebration note
    if (data.lead_id) {
      await repository.createNote({
        lead_id: data.lead_id,
        note_type: "System",
        content: `Deal CLOSED WON! Commission earned: ${data.commission_amount || 0}`
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error closing deal won:", err);
    res.status(500).json({ error: "Failed to close deal" });
  }
};

// Close deal (lost)
exports.closeDealLost = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updates = {
      deal_stage: "Closed Lost",
      notes,
      updated_at: new Date().toISOString()
    };

    const data = await repository.updateDeal(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Deal not found" });
    }

    // Add note
    if (data.lead_id) {
      await repository.createNote({
        lead_id: data.lead_id,
        note_type: "System",
        content: `Deal lost. Reason: ${notes || "Not specified"}`
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error closing deal lost:", err);
    res.status(500).json({ error: "Failed to update deal" });
  }
};

// Record payment received
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const deal = await repository.getDealById(id);
    if (!deal) {
      return res.status(404).json({ error: "Deal not found" });
    }

    const newAmount = (parseFloat(deal.amount_received) || 0) + (parseFloat(amount) || 0);
    const paymentStatus = newAmount >= (parseFloat(deal.commission_amount) || 0) ? "Received" : "Partial";

    const data = await repository.updateDeal(id, {
      amount_received: newAmount,
      payment_status: paymentStatus,
      updated_at: new Date().toISOString()
    });

    // Add note
    if (data && data.lead_id) {
      await repository.createNote({
        lead_id: data.lead_id,
        note_type: "System",
        content: `Payment received: ${amount}. Total received: ${newAmount}`
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error recording payment:", err);
    res.status(500).json({ error: "Failed to record payment" });
  }
};

// Delete deal
exports.deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await repository.deleteDeal(id);

    if (!success) {
      return res.status(404).json({ error: "Deal not found" });
    }

    res.json({ message: "Deal deleted successfully" });
  } catch (err) {
    console.error("Error deleting deal:", err);
    res.status(500).json({ error: "Failed to delete deal" });
  }
};

// Get deal pipeline statistics
exports.getDealPipelineStats = async (req, res) => {
  try {
    const response = await repository.getDeals();
    const dealsList = Array.isArray(response) ? response : (response?.data || []);
    const pipeline = dealsList.reduce((acc, d) => {
      const stage = d.deal_stage || 'New';
      if (!acc[stage]) {
        acc[stage] = { stage, count: 0, total_value: 0, total_commission: 0 };
      }
      acc[stage].count++;
      acc[stage].total_value += parseFloat(d.deal_value) || 0;
      acc[stage].total_commission += parseFloat(d.commission_amount) || 0;
      return acc;
    }, {});

    res.json(Object.values(pipeline));
  } catch (err) {
    console.error("Error fetching pipeline stats:", err);
    res.status(500).json({ error: "Failed to fetch pipeline stats" });
  }
};

// Get commission statistics
exports.getCommissionStats = async (req, res) => {
  try {
    const stats = await repository.getCommissionStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching commission stats:", err);
    res.status(500).json({ error: "Failed to fetch commission stats" });
  }
};

// Get monthly deal trends
exports.getMonthlyTrends = async (req, res) => {
  try {
    const data = await repository.getDeals();

    // Group by month
    const monthly = (data || []).reduce((acc, deal) => {
      const month = new Date(deal.created_at || Date.now()).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, deals: 0, value: 0, commission: 0, won: 0 };
      }
      acc[month].deals++;
      acc[month].value += parseFloat(deal.deal_value) || 0;
      acc[month].commission += parseFloat(deal.commission_amount) || 0;
      if (deal.deal_stage === "Closed Won") acc[month].won++;
      return acc;
    }, {});

    res.json(Object.values(monthly));
  } catch (err) {
    console.error("Error fetching monthly trends:", err);
    res.status(500).json({ error: "Failed to fetch monthly trends" });
  }
};
