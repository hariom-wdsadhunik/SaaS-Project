const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({ error: "Validation failed", details: errors });
    }
    next();
  };
};

const sanitize = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== "string") return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .trim();
  };

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        sanitized[key] = sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string" ? sanitizeString(item) : item
        );
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

const schemas = {
  createLead: Joi.object({
    phone: Joi.string().pattern(/^\+?[\d\s-]{10,15}$/).required(),
    name: Joi.string().min(1).max(100),
    email: Joi.string().email(),
    budget: Joi.string().max(50),
    location: Joi.string().max(200),
    message: Joi.string().max(2000),
    source: Joi.string().valid("whatsapp", "website", "referral", "cold_call", "other"),
    status: Joi.string().valid("new", "contacted", "followup", "closed"),
  }),

  updateLead: Joi.object({
    phone: Joi.string().pattern(/^\+?[\d\s-]{10,15}$/),
    name: Joi.string().min(1).max(100),
    email: Joi.string().email(),
    budget: Joi.string().max(50),
    location: Joi.string().max(200),
    message: Joi.string().max(2000),
    source: Joi.string().valid("whatsapp", "website", "referral", "cold_call", "other"),
    status: Joi.string().valid("new", "contacted", "followup", "closed"),
    assigned_to: Joi.string().uuid(),
    ai_priority: Joi.string().valid("hot", "warm", "cold", "nurture"),
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    name: Joi.string().min(1).max(100).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createTask: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000),
    lead_id: Joi.string().uuid(),
    due_date: Joi.date().iso(),
    priority: Joi.string().valid("low", "medium", "high", "urgent"),
    assigned_to: Joi.string().uuid(),
  }),

  createAppointment: Joi.object({
    lead_id: Joi.string().uuid().required(),
    appointment_type: Joi.string().valid("site_visit", "call", "meeting", "other").required(),
    scheduled_at: Joi.date().iso().required(),
    duration_minutes: Joi.number().integer().min(5).max(480),
    notes: Joi.string().max(1000),
  }),

  sendWhatsApp: Joi.object({
    phone: Joi.string().pattern(/^\+?[\d\s-]{10,15}$/).required(),
    message: Joi.string().min(1).max(4096).required(),
    template: Joi.string().max(100),
  }),

  inviteMember: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(1).max(100).required(),
    role: Joi.string().valid("admin", "agent", "viewer"),
  }),

  createProperty: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(5000),
    property_type: Joi.string().valid("1bhk", "2bhk", "3bhk", "4bhk", "penthouse", "villa", "plot", "commercial").required(),
    listing_type: Joi.string().valid("sale", "rent", "lease").required(),
    price: Joi.number().positive(),
    location: Joi.string().max(200),
    area_sqft: Joi.number().positive(),
    bedrooms: Joi.number().integer().min(0),
    bathrooms: Joi.number().integer().min(0),
    status: Joi.string().valid("available", "sold", "reserved", "under_offer"),
  }),

  createDeal: Joi.object({
    lead_id: Joi.string().uuid().required(),
    property_id: Joi.string().uuid(),
    title: Joi.string().min(1).max(200).required(),
    stage: Joi.string().valid("initial", "negotiation", "agreement", "documentation", "payment", "closed_won", "closed_lost"),
    expected_value: Joi.number().min(0),
    commission_rate: Joi.number().min(0).max(100),
    closing_date: Joi.date().iso(),
  }),
};

module.exports = {
  validate,
  sanitize,
  schemas,
};
