const express = require("express");
const router = express.Router();
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentsByLead,
  getDocumentStats
} = require("../controllers/documentsController");

// Document routes
router.get("/", getDocuments);
router.get("/stats/overview", getDocumentStats);
router.get("/lead/:lead_id", getDocumentsByLead);
router.get("/:id", getDocument);
router.post("/", createDocument);
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
