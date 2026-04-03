const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const emailTemplatesController = require("../controllers/emailTemplatesController");

router.use(authenticateToken);

router.get("/templates", emailTemplatesController.getTemplates);
router.get("/templates/variables", emailTemplatesController.getVariables);
router.get("/templates/:id", emailTemplatesController.getTemplate);
router.post("/templates", emailTemplatesController.createTemplate);
router.put("/templates/:id", emailTemplatesController.updateTemplate);
router.patch("/templates/:id", emailTemplatesController.updateTemplate);
router.delete("/templates/:id", emailTemplatesController.deleteTemplate);
router.post("/templates/:id/duplicate", emailTemplatesController.duplicateTemplate);
router.post("/preview", emailTemplatesController.previewTemplate);

module.exports = router;
