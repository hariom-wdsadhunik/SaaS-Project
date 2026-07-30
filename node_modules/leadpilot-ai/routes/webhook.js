const express = require("express");
const router = express.Router();
const {
  verifyWebhook,
  handleMessage,
} = require("../controllers/whatsappController");

router.get("/", verifyWebhook);
router.post("/", handleMessage);

module.exports = router;
