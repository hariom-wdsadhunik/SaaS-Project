const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const importController = require("../controllers/importController");

router.use(authenticateToken);

router.post("/leads", importController.importLeads);
router.get("/leads/template", importController.getImportTemplate);
router.post("/leads/export", importController.exportLeads);

module.exports = router;
