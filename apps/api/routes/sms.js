const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const smsController = require("../controllers/smsController");

router.use(authenticateToken);

router.get("/status", smsController.getStatus);
router.post("/send", smsController.sendSms);
router.post("/lead", smsController.sendToLead);
router.post("/bulk", smsController.sendBulk);
router.get("/logs", smsController.getLogs);

module.exports = router;
