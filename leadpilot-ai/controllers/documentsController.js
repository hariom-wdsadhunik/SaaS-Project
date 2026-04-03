const { supabase, supabaseAnon } = require("../db/supabase");
const { v4: uuidv4 } = require("uuid");

const BUCKET_NAME = "leadpilot-files";
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

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
    
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("file_url, storage_path")
      .eq("id", id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete from Supabase Storage if file exists
    if (doc.file_url && doc.storage_path) {
      const storagePath = doc.storage_path || extractStoragePath(doc.file_url);
      if (storagePath) {
        const { error: storageError } = await supabaseAnon
          .storage
          .from("leadpilot-files")
          .remove([storagePath]);
        
        if (storageError) {
          console.error("Storage deletion warning:", storageError);
        }
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};

// Helper to extract storage path from URL
function extractStoragePath(fileUrl) {
  if (!fileUrl) return null;
  try {
    const url = new URL(fileUrl);
    const pathSegments = url.pathname.split("/");
    const bucketIndex = pathSegments.indexOf("leadpilot-files");
    if (bucketIndex !== -1 && pathSegments.length > bucketIndex + 1) {
      return pathSegments.slice(bucketIndex + 1).join("/");
    }
  } catch (e) {
    // Not a valid URL, return null
  }
  return null;
}

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

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { lead_id, property_id, deal_id, document_type, document_name } = req.body;
    const file = req.file;

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type",
        allowedTypes: ALLOWED_TYPES
      });
    }

    const fileExtension = file.originalname.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const storagePath = `documents/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${uniqueFileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAnon
      .storage
      .from(BUCKET_NAME)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return res.status(500).json({ error: "Failed to upload file to storage" });
    }

    const { data: urlData } = supabaseAnon
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const docRecord = {
      document_name: document_name || file.originalname,
      document_type: document_type || getDocumentTypeFromMime(file.mimetype),
      file_url: urlData.publicUrl,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.mimetype,
      lead_id: lead_id || null,
      property_id: property_id || null,
      deal_id: deal_id || null,
      uploaded_by: req.user?.id || null,
      created_at: new Date().toISOString(),
    };

    const { data: doc, error: dbError } = await supabase
      .from("documents")
      .insert([docRecord])
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      await supabaseAnon.storage.from(BUCKET_NAME).remove([storagePath]);
      return res.status(500).json({ error: "Failed to save document record" });
    }

    if (lead_id) {
      await supabase.from("notes").insert([{
        lead_id: lead_id,
        note_type: "System",
        content: `Document uploaded: ${docRecord.document_name} (${docRecord.document_type})`
      }]);
    }

    res.status(201).json({
      message: "File uploaded successfully",
      document: doc,
      url: urlData.publicUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload document" });
  }
};

// Get upload URL for client-side upload
exports.getUploadUrl = async (req, res) => {
  try {
    const { fileName, contentType, folder = "documents" } = req.query;

    if (!fileName || !contentType) {
      return res.status(400).json({ error: "fileName and contentType are required" });
    }

    const fileExtension = fileName.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const storagePath = `${folder}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${uniqueFileName}`;

    const { data, error } = await supabaseAnon
      .storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(storagePath);

    if (error) {
      console.error("Signed URL error:", error);
      return res.status(500).json({ error: "Failed to generate upload URL" });
    }

    res.json({
      uploadUrl: data.url,
      storagePath,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Get upload URL error:", err);
    res.status(500).json({ error: "Failed to get upload URL" });
  }
};

function getDocumentTypeFromMime(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word")) return "document";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "spreadsheet";
  return "other";
}
