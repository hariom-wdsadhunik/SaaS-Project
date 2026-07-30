const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const goalsController = require("../controllers/goalsController");

router.use(authenticateToken);

router.get("/", goalsController.getGoals);
router.post("/", goalsController.createGoal);
router.get("/:id", goalsController.getGoalProgress);
router.patch("/:id", goalsController.updateGoal);
router.put("/:id", goalsController.updateGoal);
router.delete("/:id", goalsController.deleteGoal);

module.exports = router;
