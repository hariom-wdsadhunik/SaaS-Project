const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Appointments API Integration Tests (routes/appointments.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should schedule an appointment, complete with feedback via PATCH, and check upcoming filter', async () => {
    const createRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Site Inspection', lead_id: 'lead-1', scheduled_at: new Date(Date.now() + 86400000).toISOString() });

    expect(createRes.statusCode).toBe(201);
    const apptId = createRes.body.id;

    const completeRes = await request(app)
      .patch(`/api/appointments/${apptId}/complete`)
      .set('Authorization', `Bearer ${token}`)
      .send({ feedback: 'Client loved the master bedroom', rating: 5 });

    expect(completeRes.statusCode).toBe(200);
    expect(completeRes.body.status).toBe('Completed');

    const upcomingRes = await request(app)
      .get('/api/appointments/upcoming/list')
      .set('Authorization', `Bearer ${token}`);

    expect(upcomingRes.statusCode).toBe(200);
  });
});
