const repository = require("../db");
const { supabaseAnon } = require("../db/supabase");
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
    const data = await repository.getDocuments(req.query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Get single document
exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repository.getDocumentById(id);

    if (!data) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(500).json({ error: "Document not found" });
  }
};

// Create document record
exports.createDocument = async (req, res) => {
  try {
    const docData = req.body;
    const data = await repository.createDocument(docData);

    // Add note about document upload
    if (docData.lead_id) {
      await repository.createNote({
        lead_id: docData.lead_id,
        note_type: "System",
        content: `Document uploaded: ${docData.document_name} (${docData.document_type})`
      });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating document record:", err);
    res.status(500).json({ error: "Failed to create document record" });
  }
};

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const data = await repository.updateDocument(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ error: "Failed to update document" });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await repository.getDocumentById(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete from Supabase Storage if file & client exists
    if (doc.file_url && doc.storage_path && supabaseAnon?.storage) {
      const storagePath = doc.storage_path || extractStoragePath(doc.file_url);
      if (storagePath) {
        try {
          await supabaseAnon.storage.from("leadpilot-files").remove([storagePath]);
        } catch (storageError) {
          console.error("Storage deletion warning:", storageError);
        }
      }
    }

    // Delete from repository
    await repository.deleteDocument(id);

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
    // Not a valid URL
  }
  return null;
}

// Get documents by lead
exports.getDocumentsByLead = async (req, res) => {
  try {
    const { lead_id } = req.params;
    const data = await repository.getDocuments({ lead_id });

    // Group by document type
    const grouped = (data || []).reduce((acc, doc) => {
      const type = doc.document_type || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(doc);
      return acc;
    }, {});

    res.json({ documents: data, grouped });
  } catch (err) {
    console.error("Error fetching lead documents:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Get document statistics
exports.getDocumentStats = async (req, res) => {
  try {
    const data = await repository.getDocuments();

    const byTypeMap = (data || []).reduce((acc, d) => {
      const type = d.document_type || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const byType = Object.entries(byTypeMap).map(([document_type, count]) => ({ document_type, count }));

    res.json({
      total: data.length,
      byType
    });
  } catch (err) {
    console.error("Error fetching document stats:", err);
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
    let publicUrl = `/demo-uploads/${uniqueFileName}`;

    if (supabaseAnon?.storage) {
      const { error: uploadError } = await supabaseAnon
        .storage
        .from(BUCKET_NAME)
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (!uploadError) {
        const { data: urlData } = supabaseAnon
          .storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);
        if (urlData?.publicUrl) publicUrl = urlData.publicUrl;
      }
    }

    const docRecord = {
      document_name: document_name || file.originalname,
      document_type: document_type || getDocumentTypeFromMime(file.mimetype),
      file_url: publicUrl,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.mimetype,
      lead_id: lead_id || null,
      property_id: property_id || null,
      deal_id: deal_id || null,
      uploaded_by: req.user?.id || null,
      created_at: new Date().toISOString(),
    };

    const doc = await repository.createDocument(docRecord);

    if (lead_id) {
      await repository.createNote({
        lead_id: lead_id,
        note_type: "System",
        content: `Document uploaded: ${docRecord.document_name} (${docRecord.document_type})`
      });
    }

    res.status(201).json({
      message: "File uploaded successfully",
      document: doc,
      url: publicUrl,
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

    let uploadUrl = `/demo-upload-target`;
    if (supabaseAnon?.storage) {
      const { data } = await supabaseAnon
        .storage
        .from(BUCKET_NAME)
        .createSignedUploadUrl(storagePath);
      if (data?.url) uploadUrl = data.url;
    }

    res.json({
      uploadUrl,
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
