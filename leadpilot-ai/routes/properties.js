const express = require("express");
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats,
  matchPropertiesToLead
} = require("../controllers/propertiesController");

// Property routes
router.get("/", getProperties);
router.get("/stats", getPropertyStats);
router.get("/match/:leadId", matchPropertiesToLead);
router.get("/:id", getProperty);
router.post("/", createProperty);
router.patch("/:id", updateProperty);
router.delete("/:id", deleteProperty);

module.exports = router;
