const supabase = require("../db/supabase");

// 🥇 Get all leads
exports.getLeads = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// 🥈 Get single lead
exports.getSingleLead = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Lead not found" });
  }
};

// 🥉 Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
