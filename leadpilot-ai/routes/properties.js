const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { createPropertySchema, updatePropertySchema } = require("../schemas/propertySchemas");
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
router.post("/", validate(createPropertySchema), createProperty);
router.patch("/:id", validate(updatePropertySchema), updateProperty);
router.delete("/:id", deleteProperty);

module.exports = router;
