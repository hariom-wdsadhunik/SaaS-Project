const repository = require('../db');
const leadScoringService = require('../services/leadScoringService');

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const analytics = await repository.getDashboardAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

// Get lead trends over time
exports.getLeadTrends = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period, 10);

    const { data: leads } = await repository.getLeads({ limit: 500 });
    const trends = {};
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trends[dateStr] = { date: dateStr, count: 0, converted: 0 };
    }

    (leads || []).forEach(lead => {
      const dateStr = lead.created_at ? lead.created_at.split('T')[0] : '';
      if (trends[dateStr]) {
        trends[dateStr].count++;
        if (lead.status === 'closed') {
          trends[dateStr].converted++;
        }
      }
    });

    res.json({
      trends: Object.values(trends).reverse()
    });
  } catch (error) {
    console.error('Lead trends error:', error);
    res.status(500).json({ error: 'Failed to get lead trends' });
  }
};

// Get performance metrics
exports.getPerformanceMetrics = async (req, res) => {
  try {
    res.json({
      memberPerformance: []
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({ error: 'Failed to get performance metrics' });
  }
};

// Get AI insights
exports.getAIInsights = async (req, res) => {
  try {
    const { data: leads } = await repository.getLeads({ limit: 100 });

    const budgetRanges = {
      'Under 50L': 0,
      '50L - 1Cr': 0,
      '1Cr - 2Cr': 0,
      'Above 2Cr': 0,
      'Not specified': 0
    };

    (leads || []).forEach(lead => {
      const budget = lead.budget?.toString().toLowerCase() || '';
      if (budget.includes('cr') || budget.includes('crore')) {
        const value = parseFloat(budget);
        if (value >= 2) budgetRanges['Above 2Cr']++;
        else if (value >= 1) budgetRanges['1Cr - 2Cr']++;
        else budgetRanges['Under 50L']++;
      } else if (budget.includes('l') || budget.includes('lakh')) {
        const value = parseFloat(budget);
        if (value >= 50) budgetRanges['50L - 1Cr']++;
        else budgetRanges['Under 50L']++;
      } else {
        budgetRanges['Not specified']++;
      }
    });

    const locationCounts = {};
    (leads || []).forEach(lead => {
      const location = lead.location || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const scoredLeads = (leads || []).filter(l => l.ai_score);
    const avgScore = scoredLeads.length > 0
      ? Math.round(scoredLeads.reduce((sum, l) => sum + l.ai_score, 0) / scoredLeads.length)
      : 0;

    res.json({
      budgetRanges,
      topLocations,
      averageScore: avgScore,
      totalScored: scoredLeads.length,
      highPriorityLeads: scoredLeads.filter(l => l.ai_score >= 80).length,
      recommendations: [
        'Focus on hot leads (80+ score)',
        'Follow up with leads older than 7 days',
        'Expand marketing in top-performing locations'
      ]
    });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ error: 'Failed to get AI insights' });
  }
};
