const leadScoringService = require('../../../services/leadScoringService');

describe('Lead Scoring Service Unit Tests (services/leadScoringService.js)', () => {
  it('should score a hot lead with high budget, location, and urgent timeline', () => {
    const lead = {
      budget: '2 Cr',
      location: 'Sector 62, Gurgaon',
      phone: '9998887770',
      message: 'Urgent! Looking for 3BHK furnished flat in Sector 62, Gurgaon between 1.8 to 2Cr today ready to move family investment rent office'
    };

    const result = leadScoringService.calculateScore(lead);

    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(result.priority).toBe('hot');
    expect(result.category).toBe('High Priority');
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
    expect(result.estimatedConversion.probability).toBe('75-90%');
    expect(result.aiInsights.length).toBeGreaterThan(0);
  });

  it('should score a warm lead (60-79 points)', () => {
    const lead = {
      budget: '50 Lakhs',
      location: 'Delhi',
      phone: '9998887770',
      message: 'Looking for 2BHK flat'
    };

    const result = leadScoringService.calculateScore(lead);

    expect(result.totalScore).toBeGreaterThanOrEqual(60);
    expect(result.totalScore).toBeLessThan(80);
    expect(result.priority).toBe('warm');
    expect(result.category).toBe('Medium Priority');
    expect(result.estimatedConversion.probability).toBe('50-75%');
  });

  it('should score a cold lead (40-59 points)', () => {
    const lead = {
      location: 'Delhi',
      phone: '9998887770',
      message: 'Interested in property'
    };

    const result = leadScoringService.calculateScore(lead);

    expect(result.totalScore).toBeGreaterThanOrEqual(40);
    expect(result.totalScore).toBeLessThan(60);
    expect(result.priority).toBe('cold');
    expect(result.category).toBe('Low Priority');
    expect(result.estimatedConversion.probability).toBe('25-50%');
  });

  it('should score a nurture lead (<40 points)', () => {
    const lead = {
      phone: '123',
      message: 'hi'
    };

    const result = leadScoringService.calculateScore(lead);

    expect(result.priority).toBe('nurture');
    expect(result.category).toBe('Needs Nurturing');
    expect(result.estimatedConversion.probability).toBe('10-25%');
  });

  it('should score a low priority lead with missing budget and location', () => {
    const lead = {
      phone: '9998887770',
      message: 'Hi'
    };

    const result = leadScoringService.calculateScore(lead);

    expect(result.totalScore).toBeLessThan(60);
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        'Ask the lead about their budget range',
        'Ask for preferred location or area'
      ])
    );
  });

  it('should calculate score distribution across a collection of leads', () => {
    const leads = [
      { ai_score: 85 },
      { ai_score: 70 },
      { ai_score: 50 },
      { ai_score: 30 }
    ];

    const distribution = leadScoringService.getScoreDistribution(leads);

    expect(distribution.distribution.hot).toBe(1);
    expect(distribution.distribution.warm).toBe(1);
    expect(distribution.distribution.cold).toBe(1);
    expect(distribution.distribution.nurture).toBe(1);
    expect(distribution.averageScore).toBe(59);
    expect(distribution.totalScored).toBe(4);
  });

  it('should handle empty datasets for score distribution', () => {
    const distribution = leadScoringService.getScoreDistribution([]);
    expect(distribution.averageScore).toBe(0);
    expect(distribution.totalScored).toBe(0);
  });
});
