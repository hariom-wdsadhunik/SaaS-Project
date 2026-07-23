const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createLeadSchema, updateLeadSchema } = require("../schemas/leadSchemas");
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
router.post("/", validate(createLeadSchema), createLead);
router.get("/:id", getSingleLead);
router.patch("/:id", validate(updateLeadSchema), updateLeadStatus);
router.delete("/:id", deleteLead);

module.exports = router;
