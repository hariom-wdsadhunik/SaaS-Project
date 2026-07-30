const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const reportService = require("../services/reportService");

router.use(authenticateToken);

router.get("/types", reportService.getReportTypes);
router.post("/generate", reportService.generateReport);

module.exports = router;
