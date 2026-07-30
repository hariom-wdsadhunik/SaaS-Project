const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Dashboard analytics
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// Lead trends
router.get('/trends', analyticsController.getLeadTrends);

// Performance metrics
router.get('/performance', analyticsController.getPerformanceMetrics);

// AI insights
router.get('/insights', analyticsController.getAIInsights);

module.exports = router;
