const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getLeads,
  getSingleLead,
  createLead,
  updateLeadStatus,
  deleteLead
} = require("../controllers/leadsController");

// All routes require authentication
router.use(authenticateToken);

router.get("/", getLeads);
router.post("/", createLead);
router.get("/:id", getSingleLead);
router.patch("/:id", updateLeadStatus);
router.delete("/:id", deleteLead);

module.exports = router;
