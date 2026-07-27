const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Goals API Integration Tests (routes/goals.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should create goal, fetch progress, and delete goal', async () => {
    const createRes = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Monthly Leads Target', metric: 'leads', target_value: 30, period: 'monthly' });

    expect(createRes.statusCode).toBe(201);
    const goalId = createRes.body.goal.id;

    const progressRes = await request(app)
      .get(`/api/goals/${goalId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(progressRes.statusCode).toBe(200);
    expect(progressRes.body.goal.progress).toBeDefined();

    const deleteRes = await request(app)
      .delete(`/api/goals/${goalId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
  });
});
