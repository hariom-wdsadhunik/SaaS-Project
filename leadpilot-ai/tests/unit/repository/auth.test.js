const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Authentication & User Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should retrieve existing user by email', async () => {
    const user = await repository.getUserByEmail('admin@leadpilot.ai');
    expect(user).not.toBeNull();
    expect(user.email).toBe('admin@leadpilot.ai');
    expect(user.role).toBe('admin');
  });

  it('should retrieve existing user by ID', async () => {
    const user = await repository.getUserById('user-1');
    expect(user).not.toBeNull();
    expect(user.id).toBe('user-1');
  });

  it('should return null when retrieving non-existent user email or ID', async () => {
    const byEmail = await repository.getUserByEmail('invalid@domain.com');
    const byId = await repository.getUserById('user-invalid-999');
    expect(byEmail).toBeNull();
    expect(byId).toBeNull();
  });

  it('should create a new user successfully', async () => {
    const newUser = await repository.createUser({
      email: 'newagent@leadpilot.ai',
      password: 'password123',
      name: 'New Agent',
      role: 'agent',
      team_id: 'team-1'
    });
    expect(newUser).toHaveProperty('id');
    expect(newUser.email).toBe('newagent@leadpilot.ai');

    const retrieved = await repository.getUserByEmail('newagent@leadpilot.ai');
    expect(retrieved).not.toBeNull();
  });

  it('should update an existing user profile', async () => {
    const updated = await repository.updateUser('user-1', { name: 'Updated Admin Name' });
    expect(updated).not.toBeNull();
    expect(updated.name).toBe('Updated Admin Name');
  });

  it('should return null when updating a non-existent user ID', async () => {
    const result = await repository.updateUser('non-existent-user-id', { name: 'Test' });
    expect(result).toBeNull();
  });
});
