const { supabase } = require("../db/supabase");

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const { lead_id, property_id, deal_id, document_type } = req.query;
    
    let query = supabase
      .from("documents")
      .select("*, users(name)")
      .order("created_at", { ascending: false });
    
    if (lead_id) query = query.eq("lead_id", lead_id);
    if (property_id) query = query.eq("property_id", property_id);
    if (deal_id) query = query.eq("deal_id", deal_id);
    if (document_type) query = query.eq("document_type", document_type);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Get single document
exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("documents")
      .select("*, users(name), leads(phone)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Document not found" });
  }
};

// Create document record
exports.createDocument = async (req, res) => {
  try {
    const docData = req.body;
    
    const { data, error } = await supabase
      .from("documents")
      .insert([docData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Add note about document upload
    if (docData.lead_id) {
      await supabase.from("notes").insert([{
        lead_id: docData.lead_id,
        note_type: "System",
        content: `Document uploaded: ${docData.document_name} (${docData.document_type})`
      }]);
    }
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create document record" });
  }
};

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update document" });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get document info first to delete from storage
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("file_url")
      .eq("id", id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete from database
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    // TODO: Delete from Supabase Storage if needed
    
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document" });
  }
};

// Get documents by lead
exports.getDocumentsByLead = async (req, res) => {
  try {
    const { lead_id } = req.params;
    
    const { data, error } = await supabase
      .from("documents")
      .select("*, users(name)")
      .eq("lead_id", lead_id)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Group by document type
    const grouped = data.reduce((acc, doc) => {
      if (!acc[doc.document_type]) acc[doc.document_type] = [];
      acc[doc.document_type].push(doc);
      return acc;
    }, {});
    
    res.json({ documents: data, grouped });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Get document statistics
exports.getDocumentStats = async (req, res) => {
  try {
    const { data: total, error: err1 } = await supabase
      .from("documents")
      .select("id", { count: "exact" });
    
    const { data: byType, error: err2 } = await supabase
      .from("documents")
      .select("document_type, count");
    
    if (err1 || err2) throw err1 || err2;
    
    res.json({
      total: total.length,
      byType: byType || []
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch document stats" });
  }
};
