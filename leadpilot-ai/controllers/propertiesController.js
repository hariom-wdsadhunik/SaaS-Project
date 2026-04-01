const { supabase } = require("../db/supabase");

// Get all properties with filters
exports.getProperties = async (req, res) => {
  try {
    const { status, city, type, minPrice, maxPrice, search } = req.query;
    
    let query = supabase.from("properties").select("*").order("created_at", { ascending: false });
    
    if (status) query = query.eq("status", status);
    if (city) query = query.ilike("city", `%${city}%`);
    if (type) query = query.eq("property_type", type);
    if (minPrice) query = query.gte("price", minPrice);
    if (maxPrice) query = query.lte("price", maxPrice);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Get single property
exports.getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("properties")
      .select("*, deals(*), appointments(*)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Property not found" });
  }
};

// Create property
exports.createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    
    const { data, error } = await supabase
      .from("properties")
      .insert([propertyData])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create property" });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update property" });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};

// Get property statistics
exports.getPropertyStats = async (req, res) => {
  try {
    const { data: totalProperties, error: err1 } = await supabase
      .from("properties")
      .select("id", { count: "exact" });
    
    const { data: available, error: err2 } = await supabase
      .from("properties")
      .select("id", { count: "exact" })
      .eq("status", "Available");
    
    const { data: sold, error: err3 } = await supabase
      .from("properties")
      .select("id", { count: "exact" })
      .eq("status", "Sold");
    
    const { data: byType, error: err4 } = await supabase
      .from("properties")
      .select("property_type, count");
    
    if (err1 || err2 || err3) throw err1 || err2 || err3;
    
    res.json({
      total: totalProperties.length,
      available: available.length,
      sold: sold.length,
      byType: byType || []
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch property stats" });
  }
};

// Match properties to lead requirements
exports.matchPropertiesToLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    
    // Get lead requirements
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*, lead_requirements(*)")
      .eq("id", leadId)
      .single();
    
    if (leadError) throw leadError;
    
    // Get available properties
    const { data: properties, error: propError } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "Available");
    
    if (propError) throw propError;
    
    // Simple matching algorithm
    const matches = properties.map(prop => {
      let score = 0;
      const reasons = [];
      
      // Budget match
      const budget = parseFloat(lead.budget?.replace(/[^0-9.]/g, '')) || 0;
      const propPrice = parseFloat(prop.price) || 0;
      if (budget > 0 && propPrice <= budget * 1.1) {
        score += 30;
        reasons.push("Within budget");
      }
      
      // Location match
      if (lead.location && prop.city && 
          (prop.city.toLowerCase().includes(lead.location.toLowerCase()) ||
           lead.location.toLowerCase().includes(prop.city.toLowerCase()))) {
        score += 25;
        reasons.push("Location matches");
      }
      
      // Property type match (extract from message)
      const message = lead.message?.toLowerCase() || '';
      if (message.includes(prop.property_type?.toLowerCase())) {
        score += 20;
        reasons.push("Property type matches");
      }
      
      return {
        property: prop,
        match_score: Math.min(score, 100),
        match_reasons: reasons
      };
    }).filter(m => m.match_score > 0).sort((a, b) => b.match_score - a.match_score);
    
    res.json(matches.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to match properties" });
  }
};
