/**
 * AI Lead Scoring Service
 * Automatically scores leads based on message quality, information completeness, and intent
 */

class LeadScoringService {
  constructor() {
    this.weights = {
      budget: 25,
      location: 20,
      propertyType: 15,
      urgency: 20,
      contactInfo: 10,
      messageLength: 10
    };
  }

  /**
   * Calculate lead score based on extracted information
   * @param {Object} lead - Lead object with message, budget, location, etc.
   * @returns {Object} - Score details and recommendations
   */
  calculateScore(lead) {
    let score = 0;
    const factors = [];
    const recommendations = [];

    // 1. Budget Score (25 points)
    const budgetScore = this.scoreBudget(lead.budget, lead.message);
    score += budgetScore.points;
    factors.push({ name: 'Budget', score: budgetScore.points, max: 25 });
    if (budgetScore.recommendation) recommendations.push(budgetScore.recommendation);

    // 2. Location Score (20 points)
    const locationScore = this.scoreLocation(lead.location, lead.message);
    score += locationScore.points;
    factors.push({ name: 'Location', score: locationScore.points, max: 20 });
    if (locationScore.recommendation) recommendations.push(locationScore.recommendation);

    // 3. Property Type Score (15 points)
    const propertyScore = this.scorePropertyType(lead.message);
    score += propertyScore.points;
    factors.push({ name: 'Property Type', score: propertyScore.points, max: 15 });
    if (propertyScore.recommendation) recommendations.push(propertyScore.recommendation);

    // 4. Urgency Score (20 points)
    const urgencyScore = this.scoreUrgency(lead.message);
    score += urgencyScore.points;
    factors.push({ name: 'Urgency', score: urgencyScore.points, max: 20 });

    // 5. Contact Info Score (10 points)
    const contactScore = this.scoreContactInfo(lead.phone, lead.message);
    score += contactScore.points;
    factors.push({ name: 'Contact Info', score: contactScore.points, max: 10 });

    // 6. Message Quality Score (10 points)
    const qualityScore = this.scoreMessageQuality(lead.message);
    score += qualityScore.points;
    factors.push({ name: 'Message Quality', score: qualityScore.points, max: 10 });

    // Determine priority and category
    const { priority, category } = this.determinePriority(score, factors);

    return {
      totalScore: Math.round(score),
      maxScore: 100,
      priority,
      category,
      factors,
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
      aiInsights: this.generateInsights(lead, factors),
      estimatedConversion: this.estimateConversion(score)
    };
  }

  scoreBudget(budget, message) {
    if (!budget) {
      return {
        points: 0,
        recommendation: 'Ask the lead about their budget range'
      };
    }

    const budgetStr = budget.toString().toLowerCase();
    let points = 15;

    // Higher score for specific amounts
    if (budgetStr.includes('cr') || budgetStr.includes('crore')) {
      points = 25;
    } else if (budgetStr.includes('l') || budgetStr.includes('lakh')) {
      points = 22;
    }

    // Check for range (e.g., "80L to 1Cr")
    if (message && (message.includes('to') || message.includes('-') || message.includes('between'))) {
      points += 3;
    }

    return { points: Math.min(points, 25) };
  }

  scoreLocation(location, message) {
    if (!location) {
      return {
        points: 0,
        recommendation: 'Ask for preferred location or area'
      };
    }

    let points = 15;
    const locationStr = location.toLowerCase();

    // Specific area mentioned
    const specificAreas = ['sector', 'block', 'phase', 'near', 'opp', 'behind', 'road', 'nagar'];
    if (specificAreas.some(area => locationStr.includes(area))) {
      points = 20;
    }

    // Multiple locations
    if (message && (message.includes('or') || message.includes(',')) && message.split(',').length > 1) {
      points -= 2; // Slightly lower for multiple options
    }

    return { points: Math.min(points, 20) };
  }

  scorePropertyType(message) {
    if (!message) return { points: 0 };

    const msg = message.toLowerCase();
    let points = 0;

    // BHK mentioned
    const bhkMatch = msg.match(/(\d+)\s*bhk/i);
    if (bhkMatch) {
      points = 15;
    } else if (msg.includes('flat') || msg.includes('apartment') || msg.includes('house') || msg.includes('villa')) {
      points = 10;
    } else if (msg.includes('property') || msg.includes('home')) {
      points = 8;
    }

    // Additional requirements
    if (msg.includes('furnished') || msg.includes('parking') || msg.includes('garden') || msg.includes('balcony')) {
      points += 3;
    }

    if (points === 0) {
      return {
        points: 0,
        recommendation: 'Ask about property type preference (1BHK, 2BHK, etc.)'
      };
    }

    return { points: Math.min(points, 15) };
  }

  scoreUrgency(message) {
    if (!message) return { points: 5 };

    const msg = message.toLowerCase();
    let points = 5;

    // High urgency keywords
    const highUrgency = ['urgent', 'immediately', 'asap', 'this week', 'tomorrow', 'today', 'ready to move'];
    const mediumUrgency = ['soon', 'next month', 'within', 'quickly', 'fast'];

    if (highUrgency.some(word => msg.includes(word))) {
      points = 20;
    } else if (mediumUrgency.some(word => msg.includes(word))) {
      points = 15;
    }

    // Timeline mentioned
    if (msg.match(/\d+\s*(day|week|month)/i)) {
      points += 3;
    }

    return { points: Math.min(points, 20) };
  }

  scoreContactInfo(phone, message) {
    let points = 5;

    // Valid phone number
    if (phone && phone.length >= 10) {
      points = 10;
    }

    // Alternative contact mentioned
    if (message && (message.includes('email') || message.includes('call') || message.includes('whatsapp'))) {
      points += 2;
    }

    return { points: Math.min(points, 10) };
  }

  scoreMessageQuality(message) {
    if (!message) return { points: 0 };

    let points = 5;
    const length = message.length;

    // Message length scoring
    if (length > 100) points = 10;
    else if (length > 50) points = 8;
    else if (length > 20) points = 6;

    // Clear requirements
    const clearIndicators = ['looking for', 'need', 'want', 'require', 'interested in'];
    if (clearIndicators.some(indicator => message.toLowerCase().includes(indicator))) {
      points += 2;
    }

    return { points: Math.min(points, 10) };
  }

  determinePriority(totalScore, factors) {
    let priority, category;

    if (totalScore >= 80) {
      priority = 'hot';
      category = 'High Priority';
    } else if (totalScore >= 60) {
      priority = 'warm';
      category = 'Medium Priority';
    } else if (totalScore >= 40) {
      priority = 'cold';
      category = 'Low Priority';
    } else {
      priority = 'nurture';
      category = 'Needs Nurturing';
    }

    return { priority, category };
  }

  generateInsights(lead, factors) {
    const insights = [];
    const msg = (lead.message || '').toLowerCase();

    // Budget insights
    if (msg.includes('investment') || msg.includes('invest')) {
      insights.push('Lead appears to be an investor - prioritize ROI discussion');
    }

    if (msg.includes('rent') || msg.includes('rental')) {
      insights.push('Looking for rental property - focus on rental yield');
    }

    if (msg.includes('family') || msg.includes('kids') || msg.includes('children')) {
      insights.push('Family-oriented buyer - emphasize schools and amenities');
    }

    if (msg.includes('office') || msg.includes('work') || msg.includes('commute')) {
      insights.push('Working professional - highlight connectivity and commute');
    }

    // Urgency insights
    const urgentFactors = factors.filter(f => f.name === 'Urgency' && f.score >= 15);
    if (urgentFactors.length > 0) {
      insights.push('High urgency detected - contact within 2 hours for best results');
    }

    return insights.length > 0 ? insights : ['Standard lead - follow up within 24 hours'];
  }

  estimateConversion(score) {
    if (score >= 80) return { probability: '75-90%', timeframe: '1-2 weeks' };
    if (score >= 60) return { probability: '50-75%', timeframe: '2-4 weeks' };
    if (score >= 40) return { probability: '25-50%', timeframe: '1-2 months' };
    return { probability: '10-25%', timeframe: '3+ months' };
  }

  /**
   * Get scoring summary for analytics
   */
  getScoreDistribution(leads) {
    const distribution = {
      hot: 0,
      warm: 0,
      cold: 0,
      nurture: 0
    };

    const totalScore = leads.reduce((sum, lead) => {
      const score = lead.ai_score || 0;
      if (score >= 80) distribution.hot++;
      else if (score >= 60) distribution.warm++;
      else if (score >= 40) distribution.cold++;
      else distribution.nurture++;
      return sum + score;
    }, 0);

    return {
      distribution,
      averageScore: leads.length > 0 ? Math.round(totalScore / leads.length) : 0,
      totalScored: leads.length
    };
  }
}

module.exports = new LeadScoringService();
