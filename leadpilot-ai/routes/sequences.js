const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getSequences,
  getSequence,
  createSequence,
  updateSequence,
  deleteSequence,
  enrollLeads,
  enrollSingleLead,
  getEnrollments,
} = require("../services/sequenceService");

router.use(authenticateToken);

router.get("/", getSequences);
router.get("/enrollments", getEnrollments);
router.get("/:id", getSequence);
router.post("/", createSequence);
router.patch("/:id", updateSequence);
router.put("/:id", updateSequence);
router.delete("/:id", deleteSequence);
router.post("/enroll", enrollSingleLead);
router.post("/enroll/bulk", enrollLeads);

module.exports = router;
