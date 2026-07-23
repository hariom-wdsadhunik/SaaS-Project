const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { cronAuth } = require("../middleware/cronAuth");
const {
  sequenceService,
  getSequences,
  getSequence,
  createSequence,
  updateSequence,
  deleteSequence,
  enrollLeads,
  enrollSingleLead,
  getEnrollments,
} = require("../services/sequenceService");

// Public / Cron Protected Route (Must be mounted before authenticateToken middleware)
router.post("/process-jobs", cronAuth, async (req, res) => {
  const result = await sequenceService.processPendingJobs();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

// Protected routes (User JWT)
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
