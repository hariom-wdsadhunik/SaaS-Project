const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getSettings,
  setSetting,
  setMultipleSettings,
  deleteSetting,
  getNotificationSettings,
  setNotificationSettings,
  getIntegrations
} = require("../controllers/settingsController");

router.use(authenticateToken);

router.get("/", getSettings);
router.post("/", setSetting);
router.post("/bulk", setMultipleSettings);
router.delete("/:key", deleteSetting);

router.get("/notifications", getNotificationSettings);
router.post("/notifications", setNotificationSettings);

router.get("/integrations", getIntegrations);

module.exports = router;
