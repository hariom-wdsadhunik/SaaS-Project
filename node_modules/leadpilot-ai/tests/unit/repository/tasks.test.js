const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Task Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should create a new task', async () => {
    const task = await repository.createTask({
      title: 'Call Client',
      priority: 'High',
      status: 'Pending'
    });
    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Call Client');
  });

  it('should get paginated tasks', async () => {
    const result = await repository.getTasks({ page: 1, limit: 10 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('pagination');
  });

  it('should retrieve today tasks and task statistics', async () => {
    const today = await repository.getTodayTasks();
    const stats = await repository.getTaskStats();
    expect(Array.isArray(today)).toBe(true);
    expect(stats).toHaveProperty('pending');
    expect(stats).toHaveProperty('completed');
  });

  it('should update and delete a task', async () => {
    const task = await repository.createTask({ title: 'Temporary Task' });
    const updated = await repository.updateTask(task.id, { status: 'Completed' });
    expect(updated.status).toBe('Completed');

    const deleted = await repository.deleteTask(task.id);
    expect(deleted).toBe(true);
  });
});
