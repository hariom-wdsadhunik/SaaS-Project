const { supabase } = require("../db/supabase");

// Get all deals with filters
exports.getDeals = async (req, res) => {
  try {
    const { status, lead_id, property_id, closed_by, from_date, to_date } = req.query;
    
    let query = supabase
      .from("deals")
      .select("*, leads(phone, message), properties(title, address), users(name)")
      .order("created_at", { ascending: false });
    
    if (status) query = query.eq("deal_stage", status);
    if (lead_id) query = query.eq("lead_id", lead_id);
    if (property_id) query = query.eq("property_id", property_id);
    if (closed_by) query = query.eq("closed_by", closed_by);
    if (from_date) query = query.gte("created_at", from_date);
    if (to_date) query = query.lte("created_at", to_date);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch deals" });
  }
};

// Get single deal
exports.getDeal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("deals")
      .select("*, leads(*), properties(*), users(name)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Deal not found" });
  }
};

// Create deal
exports.createDeal = async (req, res) => {
  try {
    const dealData = req.body;
    
    // Calculate commission amount
    if (dealData.deal_value && dealData.commission_percentage) {
      dealData.commission_amount = (dealData.deal_value * dealData.commission_percentage) / 100;
    }
    
    const { data, error } = await supabase
      .from("deals")
      .insert([dealData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update lead status to closed
    if (dealData.lead_id) {
      await supabase
        .from("leads")
        .update({ status: "closed", updated_at: new Date().toISOString() })
        .eq("id", dealData.lead_id);
    }
    
    // Add note about deal creation
    await supabase.from("notes").insert([{
      lead_id: dealData.lead_id,
      note_type: "System",
      content: `Deal created: Value ${dealData.deal_value}, Commission ${dealData.commission_amount}`
    }]);
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create deal" });
  }
};

// Update deal
exports.updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date().toISOString();
    
    // Recalculate commission if value or percentage changed
    if (updates.deal_value || updates.commission_percentage) {
      const { data: current } = await supabase
        .from("deals")
        .select("deal_value, commission_percentage")
        .eq("id", id)
        .single();
      
      const value = updates.deal_value || current.deal_value;
      const percentage = updates.commission_percentage || current.commission_percentage;
      updates.commission_amount = (value * percentage) / 100;
    }
    
    const { data, error } = await supabase
      .from("deals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update deal" });
  }
};

// Close deal (won)
exports.closeDealWon = async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_close_date, notes } = req.body;
    
    const { data, error } = await supabase
      .from("deals")
      .update({
        deal_stage: "Closed Won",
        actual_close_date: actual_close_date || new Date().toISOString().split('T')[0],
        notes,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update property status to sold
    if (data.property_id) {
      await supabase
        .from("properties")
        .update({ status: "Sold", updated_at: new Date().toISOString() })
        .eq("id", data.property_id);
    }
    
    // Add celebration note
    await supabase.from("notes").insert([{
      lead_id: data.lead_id,
      note_type: "System",
      content: `Deal CLOSED WON! Commission earned: ${data.commission_amount}`
    }]);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to close deal" });
  }
};

// Close deal (lost)
exports.closeDealLost = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const { data, error } = await supabase
      .from("deals")
      .update({
        deal_stage: "Closed Lost",
        notes,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add note
    await supabase.from("notes").insert([{
      lead_id: data.lead_id,
      note_type: "System",
      content: `Deal lost. Reason: ${notes || "Not specified"}`
    }]);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update deal" });
  }
};

// Record payment received
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    const { data: deal, error: fetchError } = await supabase
      .from("deals")
      .select("amount_received, commission_amount")
      .eq("id", id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newAmount = (deal.amount_received || 0) + amount;
    const paymentStatus = newAmount >= deal.commission_amount ? "Received" : "Partial";
    
    const { data, error } = await supabase
      .from("deals")
      .update({
        amount_received: newAmount,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add note
    await supabase.from("notes").insert([{
      lead_id: data.lead_id,
      note_type: "System",
      content: `Payment received: ${amount}. Total received: ${newAmount}`
    }]);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to record payment" });
  }
};

// Delete deal
exports.deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from("deals")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    res.json({ message: "Deal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete deal" });
  }
};

// Get deal pipeline statistics
exports.getDealPipelineStats = async (req, res) => {
  try {
    const { data: pipeline, error } = await supabase
      .from("deals")
      .select("deal_stage, count, sum(deal_value), sum(commission_amount)");
    
    if (error) throw error;
    
    res.json(pipeline || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pipeline stats" });
  }
};

// Get commission statistics
exports.getCommissionStats = async (req, res) => {
  try {
    const { closed_by, from_date, to_date } = req.query;
    
    let query = supabase
      .from("deals")
      .select("commission_amount, amount_received, deal_stage, actual_close_date");
    
    if (closed_by) query = query.eq("closed_by", closed_by);
    if (from_date) query = query.gte("actual_close_date", from_date);
    if (to_date) query = query.lte("actual_close_date", to_date);
    
    const { data, error } = await query;
    if (error) throw error;
    
    const wonDeals = data.filter(d => d.deal_stage === "Closed Won");
    const totalCommission = wonDeals.reduce((sum, d) => sum + (d.commission_amount || 0), 0);
    const totalReceived = wonDeals.reduce((sum, d) => sum + (d.amount_received || 0), 0);
    
    res.json({
      totalDeals: data.length,
      wonDeals: wonDeals.length,
      totalCommission,
      totalReceived,
      pendingAmount: totalCommission - totalReceived,
      conversionRate: data.length > 0 ? Math.round((wonDeals.length / data.length) * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch commission stats" });
  }
};

// Get monthly deal trends
exports.getMonthlyTrends = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("deals")
      .select("created_at, deal_value, commission_amount, deal_stage")
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    
    // Group by month
    const monthly = data.reduce((acc, deal) => {
      const month = new Date(deal.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, deals: 0, value: 0, commission: 0, won: 0 };
      }
      acc[month].deals++;
      acc[month].value += deal.deal_value || 0;
      acc[month].commission += deal.commission_amount || 0;
      if (deal.deal_stage === "Closed Won") acc[month].won++;
      return acc;
    }, {});
    
    res.json(Object.values(monthly));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly trends" });
  }
};
