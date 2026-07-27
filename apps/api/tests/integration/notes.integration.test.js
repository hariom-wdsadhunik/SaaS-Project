const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('Notes API Integration Tests (routes/notes.js)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should log a call, update lead status, and build communication timeline', async () => {
    const leadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '9997776665', name: 'Call Lead', status: 'new' });

    const leadId = leadRes.body.id;

    const callRes = await request(app)
      .post('/api/notes/call')
      .set('Authorization', `Bearer ${token}`)
      .send({ lead_id: leadId, content: 'Spoke about 3BHK', call_duration: 180, call_outcome: 'Answered' });

    expect(callRes.statusCode).toBe(201);

    const checkLead = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(checkLead.body.status).toBe('contacted');

    const timelineRes = await request(app)
      .get(`/api/notes/timeline/${leadId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(timelineRes.statusCode).toBe(200);
    expect(Array.isArray(timelineRes.body)).toBe(true);
  });
});
