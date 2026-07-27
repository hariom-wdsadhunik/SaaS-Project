const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Lead Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should create a new lead successfully', async () => {
    const newLead = await repository.createLead({
      name: 'Test Lead',
      email: 'testlead@example.com',
      phone: '9998887770',
      status: 'new'
    });
    expect(newLead).toHaveProperty('id');
    expect(newLead.name).toBe('Test Lead');
  });

  it('should retrieve a lead by ID', async () => {
    const lead = await repository.getLeadById('lead-1');
    expect(lead).not.toBeNull();
    expect(lead.id).toBe('lead-1');
  });

  it('should return null for non-existent lead ID', async () => {
    const lead = await repository.getLeadById('non-existent-id');
    expect(lead).toBeNull();
  });

  it('should get paginated leads with default limit and total count', async () => {
    const result = await repository.getLeads();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('pagination');
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(50);
  });

  it('should filter leads by search term', async () => {
    const result = await repository.getLeads({ search: 'Rajesh' });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].name).toContain('Rajesh');
  });

  it('should update an existing lead', async () => {
    const updated = await repository.updateLead('lead-1', { status: 'qualified' });
    expect(updated).not.toBeNull();
    expect(updated.status).toBe('qualified');
  });

  it('should delete an existing lead', async () => {
    const created = await repository.createLead({ name: 'Delete Me', email: 'del@example.com' });
    const deleted = await repository.deleteLead(created.id);
    expect(deleted).toBe(true);

    const check = await repository.getLeadById(created.id);
    expect(check).toBeNull();
  });

  it('should gracefully handle deletion of missing records', async () => {
    const deleted = await repository.deleteLead('non-existent-lead-id');
    expect(deleted).toBe(false);
  });

  it('should gracefully handle updates on non-existent lead records', async () => {
    const updated = await repository.updateLead('non-existent-lead-id', { status: 'closed' });
    expect(updated).toBeNull();
  });

  it('should cap page limit at 100 when excessive limit is requested', async () => {
    const result = await repository.getLeads({ limit: 500 });
    expect(result.pagination.limit).toBe(100);
  });
});
