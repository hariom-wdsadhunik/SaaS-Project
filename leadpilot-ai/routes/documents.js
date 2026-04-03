const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentsByLead,
  getDocumentStats,
  uploadDocument,
  getUploadUrl
} = require("../controllers/documentsController");
const { authenticateToken } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStream ? multer.memoryStream() : multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.get("/", getDocuments);
router.get("/stats/overview", getDocumentStats);
router.get("/lead/:lead_id", getDocumentsByLead);
router.get("/upload-url", authenticateToken, getUploadUrl);
router.get("/:id", getDocument);
router.post("/", upload.single("file"), authenticateToken, uploadDocument);
router.post("/record", createDocument);
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
