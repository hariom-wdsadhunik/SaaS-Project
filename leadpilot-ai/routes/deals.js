const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { createDealSchema, updateDealSchema } = require("../schemas/dealSchemas");
const {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  closeDealWon,
  closeDealLost,
  recordPayment,
  deleteDeal,
  getDealPipelineStats,
  getCommissionStats,
  getMonthlyTrends
} = require("../controllers/dealsController");

// Deal routes
router.get("/", getDeals);
router.get("/pipeline/stats", getDealPipelineStats);
router.get("/commission/stats", getCommissionStats);
router.get("/trends/monthly", getMonthlyTrends);
router.get("/:id", getDeal);
router.post("/", validate(createDealSchema), createDeal);
router.patch("/:id", validate(updateDealSchema), updateDeal);
router.patch("/:id/close-won", closeDealWon);
router.patch("/:id/close-lost", closeDealLost);
router.patch("/:id/payment", recordPayment);
router.delete("/:id", deleteDeal);

module.exports = router;
