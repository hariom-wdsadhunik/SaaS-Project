const repository = require("../db");

// Get all properties with filters
exports.getProperties = async (req, res) => {
  try {
    const data = await repository.getProperties(req.query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Get single property
exports.getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repository.getPropertyById(id);

    if (!data) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ error: "Property not found" });
  }
};

// Create property
exports.createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    const data = await repository.createProperty(propertyData);

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ error: "Failed to create property" });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const data = await repository.updateProperty(id, updates);

    if (!data) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ error: "Failed to update property" });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await repository.deleteProperty(id);

    if (!success) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ error: "Failed to delete property" });
  }
};

// Get property statistics
exports.getPropertyStats = async (req, res) => {
  try {
    const stats = await repository.getPropertyStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching property stats:", err);
    res.status(500).json({ error: "Failed to fetch property stats" });
  }
};

// Match properties to lead requirements
exports.matchPropertiesToLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const matches = await repository.matchPropertiesToLead(leadId);
    res.json(matches);
  } catch (err) {
    console.error("Error matching properties:", err);
    res.status(500).json({ error: "Failed to match properties" });
  }
};
