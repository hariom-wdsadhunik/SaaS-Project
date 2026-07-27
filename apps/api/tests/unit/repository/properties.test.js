const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Property Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should create a new property', async () => {
    const prop = await repository.createProperty({
      id: 'prop-unit-1',
      title: 'Luxury Apartment',
      price: 15000000,
      city: 'Delhi',
      property_type: 'Residential',
      status: 'Available'
    });
    expect(prop).toHaveProperty('id');
    expect(prop.title).toBe('Luxury Apartment');
  });

  it('should get paginated properties', async () => {
    const result = await repository.getProperties({ page: 1, limit: 10 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('pagination');
    expect(result.pagination.page).toBe(1);
  });

  it('should retrieve property stats', async () => {
    const stats = await repository.getPropertyStats();
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('available');
  });

  it('should update an existing property', async () => {
    const created = await repository.createProperty({ id: 'prop-unit-2', title: 'Old Title', price: 5000000 });
    const updated = await repository.updateProperty(created.id, { title: 'New Title' });
    expect(updated.title).toBe('New Title');
  });

  it('should delete a property', async () => {
    const created = await repository.createProperty({ id: 'prop-unit-3', title: 'Delete Prop' });
    const deleted = await repository.deleteProperty(created.id);
    expect(deleted).toBe(true);

    const check = await repository.getPropertyById(created.id);
    expect(check).toBeNull();
  });
});
