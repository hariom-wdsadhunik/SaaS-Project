const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Team API Integration Tests (routes/team.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should fetch team details, invite members, and assign lead to member', async () => {
    const teamRes = await request(app)
      .get('/api/team')
      .set('Authorization', `Bearer ${token}`);

    expect(teamRes.statusCode).toBe(200);
    expect(teamRes.body).toHaveProperty('team');

    const inviteRes = await request(app)
      .post('/api/team/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'newagent@leadpilot.ai', name: 'New Agent', role: 'agent' });

    expect(inviteRes.statusCode).toBe(201);

    const assignRes = await request(app)
      .post('/api/team/assign/lead-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'user-2' });

    expect(assignRes.statusCode).toBe(200);
  });
});
