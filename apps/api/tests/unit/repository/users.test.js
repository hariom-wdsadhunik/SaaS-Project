const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('User Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should retrieve admin user by email', async () => {
    const user = await repository.getUserByEmail('admin@leadpilot.ai');
    expect(user).not.toBeNull();
    expect(user.email).toBe('admin@leadpilot.ai');
    expect(user.role).toBe('admin');
  });

  it('should return null for non-existent email', async () => {
    const user = await repository.getUserByEmail('nonexistent@domain.com');
    expect(user).toBeNull();
  });

  it('should create and update a user', async () => {
    const created = await repository.createUser({
      email: 'agent@leadpilot.ai',
      name: 'Agent User',
      role: 'agent'
    });
    expect(created).toHaveProperty('id');
    expect(created.email).toBe('agent@leadpilot.ai');

    const updated = await repository.updateUser(created.id, { name: 'Updated Agent Name' });
    expect(updated.name).toBe('Updated Agent Name');
  });
});
