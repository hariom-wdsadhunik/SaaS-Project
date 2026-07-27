const dealsController = require('../../../controllers/dealsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Deal Controller Contract Tests (controllers/dealsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/deals', () => {
    it('should return 200 OK with deals collection', async () => {
      const deals = [{ id: 'deal-1', title: 'Luxury Villa' }];
      jest.spyOn(repository, 'getDeals').mockResolvedValue(deals);

      await dealsController.getDeals(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(deals);
    });

    it('should return 500 Internal Server Error when repository query fails', async () => {
      jest.spyOn(repository, 'getDeals').mockRejectedValue(new Error('DB err'));

      await dealsController.getDeals(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch deals' });
    });
  });

  describe('GET /api/deals/:id', () => {
    it('should return 200 OK with single deal object', async () => {
      req.params = { id: 'deal-1' };
      const deal = { id: 'deal-1', title: 'Penthouse' };
      jest.spyOn(repository, 'getDealById').mockResolvedValue(deal);

      await dealsController.getDeal(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(deal);
    });

    it('should return 404 Not Found when deal ID does not exist', async () => {
      req.params = { id: 'deal-missing' };
      jest.spyOn(repository, 'getDealById').mockResolvedValue(null);

      await dealsController.getDeal(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Deal not found' });
    });
  });

  describe('POST /api/deals', () => {
    it('should return 201 Created with commission calculation and lead status update', async () => {
      req.body = {
        title: '3BHK Apartment',
        deal_value: 10000000,
        commission_percentage: 2,
        lead_id: 'lead-1'
      };
      const created = { id: 'deal-2', ...req.body, commission_amount: 200000 };

      jest.spyOn(repository, 'createDeal').mockResolvedValue(created);
      jest.spyOn(repository, 'updateLead').mockResolvedValue({});
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await dealsController.createDeal(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(created);
      expect(repository.updateLead).toHaveBeenCalledWith('lead-1', { status: 'closed' });
      expect(repository.createNote).toHaveBeenCalled();
    });
  });

  describe('PUT /api/deals/:id', () => {
    it('should return 200 OK with updated deal and recalculated commission', async () => {
      req.params = { id: 'deal-1' };
      req.body = { deal_value: 20000000 };
      const existing = { id: 'deal-1', deal_value: 10000000, commission_percentage: 2 };
      const updated = { id: 'deal-1', deal_value: 20000000, commission_percentage: 2, commission_amount: 400000 };

      jest.spyOn(repository, 'getDealById').mockResolvedValue(existing);
      jest.spyOn(repository, 'updateDeal').mockResolvedValue(updated);

      await dealsController.updateDeal(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it('should return 404 Not Found if deal to update is not found', async () => {
      req.params = { id: 'deal-99' };
      req.body = { deal_value: 5000000 };
      jest.spyOn(repository, 'getDealById').mockResolvedValue(null);
      jest.spyOn(repository, 'updateDeal').mockResolvedValue(null);

      await dealsController.updateDeal(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Deal not found' });
    });
  });

  describe('POST /api/deals/:id/won & /lost & /payment', () => {
    it('should close deal won and update property status to Sold', async () => {
      req.params = { id: 'deal-1' };
      req.body = { actual_close_date: '2026-07-01', notes: 'Great client' };
      const updated = { id: 'deal-1', deal_stage: 'Closed Won', property_id: 'prop-1', lead_id: 'lead-1', commission_amount: 200000 };

      jest.spyOn(repository, 'updateDeal').mockResolvedValue(updated);
      jest.spyOn(repository, 'updateProperty').mockResolvedValue({});
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await dealsController.closeDealWon(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
      expect(repository.updateProperty).toHaveBeenCalledWith('prop-1', { status: 'Sold' });
    });

    it('should close deal lost and add system note', async () => {
      req.params = { id: 'deal-1' };
      req.body = { notes: 'Budget issues' };
      const updated = { id: 'deal-1', deal_stage: 'Closed Lost', lead_id: 'lead-1' };

      jest.spyOn(repository, 'updateDeal').mockResolvedValue(updated);
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await dealsController.closeDealLost(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it('should record payment received and update payment status to Received or Partial', async () => {
      req.params = { id: 'deal-1' };
      req.body = { amount: 100000 };
      const deal = { id: 'deal-1', amount_received: 100000, commission_amount: 200000, lead_id: 'lead-1' };
      const updated = { ...deal, amount_received: 200000, payment_status: 'Received' };

      jest.spyOn(repository, 'getDealById').mockResolvedValue(deal);
      jest.spyOn(repository, 'updateDeal').mockResolvedValue(updated);
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await dealsController.recordPayment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
    });
  });

  describe('DELETE /api/deals/:id', () => {
    it('should delete deal and return success message', async () => {
      req.params = { id: 'deal-1' };
      jest.spyOn(repository, 'deleteDeal').mockResolvedValue(true);

      await dealsController.deleteDeal(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Deal deleted successfully' });
    });
  });

  describe('GET statistics (pipeline, commission, trends)', () => {
    it('should calculate pipeline stats by stage', async () => {
      const deals = [
        { deal_stage: 'Closed Won', deal_value: 1000000, commission_amount: 20000 },
        { deal_stage: 'Negotiation', deal_value: 2000000, commission_amount: 40000 }
      ];
      jest.spyOn(repository, 'getDeals').mockResolvedValue(deals);

      await dealsController.getDealPipelineStats(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ stage: 'Closed Won', count: 1, total_value: 1000000 })
        ])
      );
    });

    it('should fetch commission stats and monthly trends', async () => {
      jest.spyOn(repository, 'getCommissionStats').mockResolvedValue({ total: 100000 });
      await dealsController.getCommissionStats(req, res);
      expect(res.body).toEqual({ total: 100000 });

      jest.spyOn(repository, 'getDeals').mockResolvedValue([{ created_at: '2026-07-15T00:00:00Z', deal_value: 500000, deal_stage: 'Closed Won' }]);
      const trendsRes = createMockContext().res;
      await dealsController.getMonthlyTrends(req, trendsRes);
      expect(trendsRes.statusCode).toBe(200);
    });
  });
});
