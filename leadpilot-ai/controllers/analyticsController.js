const { supabase } = require('../db/supabase');
const leadScoringService = require('../services/leadScoringService');

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const teamId = req.user.team_id;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Build query based on user role
    let leadsQuery = supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (teamId) {
      leadsQuery = leadsQuery.eq('team_id', teamId);
    } else {
      leadsQuery = leadsQuery.eq('created_by', userId);
    }

    const { data: leads, error } = await leadsQuery;

    if (error) throw error;

    // Calculate metrics
    const metrics = {
      totalLeads: leads?.length || 0,
      newLeads: leads?.filter(l => l.status === 'new').length || 0,
      contacted: leads?.filter(l => l.status === 'contacted').length || 0,
      followUp: leads?.filter(l => l.status === 'follow-up').length || 0,
      closed: leads?.filter(l => l.status === 'closed').length || 0,
      conversionRate: leads?.length > 0 
        ? Math.round((leads.filter(l => l.status === 'closed').length / leads.length) * 100)
        : 0
    };

    // Get score distribution
    const scoreDistribution = leadScoringService.getScoreDistribution(leads || []);

    // Get leads by day (for chart)
    const leadsByDay = getLeadsByDay(leads || [], parseInt(days));

    // Get status distribution (for pie chart)
    const statusDistribution = [
      { name: 'New', value: metrics.newLeads, color: '#3b82f6' },
      { name: 'Contacted', value: metrics.contacted, color: '#f59e0b' },
      { name: 'Follow-up', value: metrics.followUp, color: '#8b5cf6' },
      { name: 'Closed', value: metrics.closed, color: '#10b981' }
    ];

    // Get top performing sources
    const sources = getTopSources(leads || []);

    // Get recent activity
    const { data: activities } = await supabase
      .from('activity_logs')
      .select('*')
      .eq(teamId ? 'team_id' : 'user_id', teamId || userId)
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      metrics,
      scoreDistribution,
      leadsByDay,
      statusDistribution,
      sources,
      recentActivity: activities || []
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

// Get lead trends over time
exports.getLeadTrends = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: leads, error } = await supabase
      .from('leads')
      .select('created_at, status, budget, location')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date
    const trends = {};
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trends[dateStr] = { date: dateStr, count: 0, converted: 0 };
    }

    leads?.forEach(lead => {
      const dateStr = lead.created_at.split('T')[0];
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
    const teamId = req.user.team_id;
    
    if (!teamId) {
      return res.json({ message: 'Team metrics only available for team accounts' });
    }

    // Get team members performance
    const { data: members } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('team_id', teamId);

    const memberPerformance = await Promise.all(
      members?.map(async (member) => {
        const { data: assignedLeads } = await supabase
          .from('leads')
          .select('status')
          .eq('assigned_to', member.id);

        const total = assignedLeads?.length || 0;
        const closed = assignedLeads?.filter(l => l.status === 'closed').length || 0;

        return {
          ...member,
          totalAssigned: total,
          closed: closed,
          conversionRate: total > 0 ? Math.round((closed / total) * 100) : 0
        };
      }) || []
    );

    // Sort by conversion rate
    memberPerformance.sort((a, b) => b.conversionRate - a.conversionRate);

    res.json({
      memberPerformance
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({ error: 'Failed to get performance metrics' });
  }
};

// Get AI insights
exports.getAIInsights = async (req, res) => {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('budget, location, status, ai_score, message')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Analyze budget ranges
    const budgetRanges = {
      'Under 50L': 0,
      '50L - 1Cr': 0,
      '1Cr - 2Cr': 0,
      'Above 2Cr': 0,
      'Not specified': 0
    };

    leads?.forEach(lead => {
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

    // Analyze locations
    const locationCounts = {};
    leads?.forEach(lead => {
      const location = lead.location || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // AI Score analysis
    const scoredLeads = leads?.filter(l => l.ai_score) || [];
    const avgScore = scoredLeads.length > 0
      ? Math.round(scoredLeads.reduce((sum, l) => sum + l.ai_score, 0) / scoredLeads.length)
      : 0;

    // Response time analysis (if available)
    const insights = {
      budgetRanges,
      topLocations,
      averageScore: avgScore,
      totalScored: scoredLeads.length,
      highPriorityLeads: scoredLeads.filter(l => l.ai_score >= 80).length,
      recommendations: generateRecommendations(leads || [])
    };

    res.json(insights);
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ error: 'Failed to get AI insights' });
  }
};

// Helper functions
function getLeadsByDay(leads, days) {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayLeads = leads.filter(l => l.created_at?.startsWith(dateStr));
    
    result.push({
      date: dateStr,
      new: dayLeads.filter(l => l.status === 'new').length,
      contacted: dayLeads.filter(l => l.status === 'contacted').length,
      closed: dayLeads.filter(l => l.status === 'closed').length
    });
  }
  
  return result;
}

function getTopSources(leads) {
  const sources = {};
  
  leads.forEach(lead => {
    const source = lead.source || 'WhatsApp';
    sources[source] = (sources[source] || 0) + 1;
  });
  
  return Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function generateRecommendations(leads) {
  const recommendations = [];
  
  const unassigned = leads.filter(l => !l.assigned_to && l.status === 'new').length;
  if (unassigned > 5) {
    recommendations.push(`${unassigned} new leads are unassigned. Consider assigning them to team members.`);
  }
  
  const oldLeads = leads.filter(l => {
    const daysSince = Math.floor((new Date() - new Date(l.created_at)) / (1000 * 60 * 60 * 24));
    return daysSince > 7 && l.status === 'new';
  }).length;
  
  if (oldLeads > 0) {
    recommendations.push(`${oldLeads} leads haven't been contacted in over a week.`);
  }
  
  const highScoreUncontacted = leads.filter(l => l.ai_score >= 80 && l.status === 'new').length;
  if (highScoreUncontacted > 0) {
    recommendations.push(`${highScoreUncontacted} high-priority leads need immediate attention!`);
  }
  
  return recommendations;
}
