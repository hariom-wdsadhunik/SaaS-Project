const tasksController = require('../../../controllers/tasksController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Task Controller Contract Tests (controllers/tasksController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/tasks', () => {
    it('should return 200 OK with task list', async () => {
      const tasks = [{ id: 'task-1', title: 'Follow up call' }];
      jest.spyOn(repository, 'getTasks').mockResolvedValue(tasks);

      await tasksController.getTasks(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(tasks);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 200 OK with single task details', async () => {
      req.params = { id: 'task-1' };
      const task = { id: 'task-1', title: 'Call Lead' };
      jest.spyOn(repository, 'getTaskById').mockResolvedValue(task);

      await tasksController.getTask(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(task);
    });

    it('should return 404 Not Found when task is missing', async () => {
      req.params = { id: 'task-99' };
      jest.spyOn(repository, 'getTaskById').mockResolvedValue(null);

      await tasksController.getTask(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('POST /api/tasks & POST /api/tasks/:id/complete', () => {
    it('should return 201 Created when task is created', async () => {
      req.body = { title: 'Site visit', lead_id: 'lead-1', due_date: '2026-08-01' };
      const created = { id: 'task-2', ...req.body };
      jest.spyOn(repository, 'createTask').mockResolvedValue(created);

      await tasksController.createTask(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(created);
    });

    it('should complete task and add note when lead_id exists', async () => {
      req.params = { id: 'task-1' };
      const completedTask = { id: 'task-1', title: 'Follow up', status: 'Completed', lead_id: 'lead-1' };

      jest.spyOn(repository, 'updateTask').mockResolvedValue(completedTask);
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await tasksController.completeTask(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(completedTask);
      expect(repository.createNote).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 200 OK when task is deleted', async () => {
      req.params = { id: 'task-1' };
      jest.spyOn(repository, 'deleteTask').mockResolvedValue(true);

      await tasksController.deleteTask(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Task deleted successfully' });
    });
  });

  describe('Filters & Stats (overdue, today, stats)', () => {
    it('should filter overdue tasks and fetch today tasks and stats', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      jest.spyOn(repository, 'getTasks').mockResolvedValue([
        { id: 't1', due_date: pastDate, status: 'Pending' }
      ]);
      await tasksController.getOverdueTasks(req, res);
      expect(res.body).toHaveLength(1);

      jest.spyOn(repository, 'getTodayTasks').mockResolvedValue([{ id: 't2' }]);
      const todayRes = createMockContext().res;
      await tasksController.getTodayTasks(req, todayRes);
      expect(todayRes.body).toEqual([{ id: 't2' }]);

      jest.spyOn(repository, 'getTaskStats').mockResolvedValue({ total: 5 });
      const statsRes = createMockContext().res;
      await tasksController.getTaskStats(req, statsRes);
      expect(statsRes.body).toEqual({ total: 5 });
    });
  });
});
