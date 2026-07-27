const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Team management
router.post('/create', teamController.createTeam);
router.get('/', teamController.getTeam);

// Member management
router.post('/invite', teamController.inviteMember);
router.delete('/members/:userId', teamController.removeMember);
router.patch('/members/:userId/role', teamController.updateMemberRole);

// Lead assignment
router.post('/assign/:leadId', teamController.assignLead);

// Activity log
router.get('/activity', teamController.getActivityLog);

module.exports = router;
