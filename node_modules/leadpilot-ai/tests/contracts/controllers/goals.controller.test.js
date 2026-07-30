const goalsController = require('../../../controllers/goalsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Goals Controller Contract Tests (controllers/goalsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/goals', () => {
    it('should return goals with calculated progress', async () => {
      const goals = [{ id: 'goal-1', name: 'Q3 Leads', metric: 'leads', target_value: 50, current_value: 10, period: 'quarterly' }];
      jest.spyOn(repository, 'getGoals').mockResolvedValue(goals);
      jest.spyOn(repository, 'getLeads').mockResolvedValue({ data: Array(15).fill({ status: 'new' }) });

      await goalsController.getGoals(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        goals: [
          expect.objectContaining({
            id: 'goal-1',
            progress: expect.objectContaining({ current: 15, percentage: 30 })
          })
        ]
      });
    });
  });

  describe('POST /api/goals', () => {
    it('should create goal when metric and period are valid', async () => {
      req.body = { name: 'Q3 Revenue', metric: 'revenue', target_value: 10000000, period: 'quarterly' };
      const created = { id: 'goal-2', ...req.body };

      jest.spyOn(repository, 'createGoal').mockResolvedValue(created);
      jest.spyOn(repository, 'getLeads').mockResolvedValue({ data: [] });
      jest.spyOn(repository, 'getDeals').mockResolvedValue([]);

      await goalsController.createGoal(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({ message: 'Goal created', goal: expect.objectContaining({ id: 'goal-2' }) }));
    });

    it('should return 400 Bad Request when metric is invalid', async () => {
      req.body = { name: 'Goal', metric: 'invalid_metric', target_value: 100, period: 'monthly' };

      await goalsController.createGoal(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(expect.objectContaining({ error: expect.stringContaining('metric must be one of') }));
    });

    it('should return 400 Bad Request when period is invalid', async () => {
      req.body = { name: 'Goal', metric: 'leads', target_value: 100, period: 'weekly' };

      await goalsController.createGoal(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(expect.objectContaining({ error: expect.stringContaining('period must be one of') }));
    });
  });

  describe('DELETE /api/goals/:id', () => {
    it('should delete goal and return success message', async () => {
      req.params = { id: 'goal-1' };
      jest.spyOn(repository, 'deleteGoal').mockResolvedValue(true);

      await goalsController.deleteGoal(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Goal deleted' });
    });
  });
});
