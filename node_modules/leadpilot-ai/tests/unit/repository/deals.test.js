const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Deal Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should create a new deal', async () => {
    const deal = await repository.createDeal({
      title: 'Commercial Plaza Deal',
      deal_value: 50000000,
      commission_percentage: 2,
      deal_stage: 'Negotiation'
    });
    expect(deal).toHaveProperty('id');
    expect(deal.title).toBe('Commercial Plaza Deal');
  });

  it('should get paginated deals', async () => {
    const result = await repository.getDeals({ page: 1, limit: 5 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('pagination');
  });

  it('should calculate commission statistics', async () => {
    const stats = await repository.getCommissionStats();
    expect(stats).toHaveProperty('totalValue');
    expect(stats).toHaveProperty('totalCommission');
  });

  it('should update deal stage', async () => {
    const created = await repository.createDeal({ title: 'Stage Deal', deal_stage: 'New' });
    const updated = await repository.updateDeal(created.id, { deal_stage: 'Closed Won' });
    expect(updated.deal_stage).toBe('Closed Won');
  });

  it('should delete a deal', async () => {
    const created = await repository.createDeal({ title: 'Delete Deal' });
    const deleted = await repository.deleteDeal(created.id);
    expect(deleted).toBe(true);
  });
});
