const analyticsController = require('../../../controllers/analyticsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Analytics Controller Contract Tests (controllers/analyticsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/analytics/dashboard', () => {
    it('should return 200 OK with dashboard analytics overview', async () => {
      const mockAnalytics = { totalLeads: 25, activeDeals: 10, totalRevenue: 5000000 };
      jest.spyOn(repository, 'getDashboardAnalytics').mockResolvedValue(mockAnalytics);

      await analyticsController.getDashboardAnalytics(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockAnalytics);
    });

    it('should return 500 Internal Server Error when query fails', async () => {
      jest.spyOn(repository, 'getDashboardAnalytics').mockRejectedValue(new Error('Analytics error'));

      await analyticsController.getDashboardAnalytics(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to get analytics' });
    });
  });

  describe('GET /api/analytics/trends & performance & ai-insights', () => {
    it('should return lead trends over specified period', async () => {
      req.query = { period: '7' };
      jest.spyOn(repository, 'getLeads').mockResolvedValue({ data: [{ created_at: new Date().toISOString(), status: 'closed' }] });

      await analyticsController.getLeadTrends(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ trends: expect.any(Array) });
    });

    it('should return member performance metrics', async () => {
      await analyticsController.getPerformanceMetrics(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ memberPerformance: [] });
    });

    it('should return AI insights with budget distribution and top locations', async () => {
      jest.spyOn(repository, 'getLeads').mockResolvedValue({
        data: [
          { budget: '1.5 Cr', location: 'Gurgaon', ai_score: 85 },
          { budget: '60 Lakhs', location: 'Delhi', ai_score: 90 }
        ]
      });

      await analyticsController.getAIInsights(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        budgetRanges: expect.any(Object),
        topLocations: expect.any(Array),
        averageScore: 88,
        totalScored: 2,
        highPriorityLeads: 2,
        recommendations: expect.any(Array)
      });
    });
  });
});
