const { app, request, getAuthToken, setupTestData, runParallel } = require('./reliability.setup');

describe('Race Condition & State Consistency Tests (Step 7)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should maintain state consistency during 10 simultaneous status updates on the same lead', async () => {
    const leadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '9988112233', name: 'Race Lead', status: 'new' });

    const leadId = leadRes.body.id;
    const statuses = ['contacted', 'qualified', 'proposal', 'negotiation', 'closed'];

    const results = await runParallel(10, (i) =>
      request(app)
        .patch(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: statuses[i % statuses.length] })
    );

    const statusCodes = results.map((r) => r.statusCode);
    expect(statusCodes.every((c) => c === 200)).toBe(true);

    const checkLead = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(checkLead.statusCode).toBe(200);
    expect(statuses).toContain(checkLead.body.status);
  });

  it('should handle simultaneous deal close-won requests consistently', async () => {
    const dealRes = await request(app)
      .post('/api/deals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Race Deal', deal_value: 5000000 });

    const dealId = dealRes.body.id;

    const results = await runParallel(5, () =>
      request(app)
        .patch(`/api/deals/${dealId}/close-won`)
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Simultaneous close' })
    );

    const statusCodes = results.map((r) => r.statusCode);
    expect(statusCodes.every((c) => c === 200)).toBe(true);

    const checkDeal = await request(app)
      .get(`/api/deals/${dealId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(checkDeal.body.deal_stage).toBe('Closed Won');
  });

  it('should process simultaneous call logs for the same lead without note collision', async () => {
    const leadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '9988223344', name: 'Race Call Lead' });

    const leadId = leadRes.body.id;

    const results = await runParallel(5, (i) =>
      request(app)
        .post('/api/notes/call')
        .set('Authorization', `Bearer ${token}`)
        .send({ lead_id: leadId, content: `Concurrent call log ${i}`, call_duration: 60 })
    );

    const statusCodes = results.map((r) => r.statusCode);
    expect(statusCodes.every((c) => c === 201)).toBe(true);

    const timeline = await request(app)
      .get(`/api/notes/timeline/${leadId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(timeline.body.length).toBeGreaterThanOrEqual(5);
  });
});
