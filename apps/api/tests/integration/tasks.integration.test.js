const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Tasks API Integration Tests (routes/tasks.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should create a task, complete it via PATCH, and retrieve today/overdue filters', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Schedule site visit', lead_id: 'lead-1', due_date: new Date().toISOString() });

    expect(createRes.statusCode).toBe(201);
    const taskId = createRes.body.id;

    const completeRes = await request(app)
      .patch(`/api/tasks/${taskId}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(completeRes.statusCode).toBe(200);
    expect(completeRes.body.status).toBe('Completed');

    const todayRes = await request(app)
      .get('/api/tasks/today/list')
      .set('Authorization', `Bearer ${token}`);

    expect(todayRes.statusCode).toBe(200);
  });
});
