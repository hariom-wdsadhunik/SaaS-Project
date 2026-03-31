const express = require("express");
const router = express.Router();
const {
  getLeads,
  updateLeadStatus,
  getSingleLead
} = require("../controllers/leadsController");

router.get("/", getLeads);
router.get("/:id", getSingleLead);
router.patch("/:id", updateLeadStatus);

module.exports = router;
