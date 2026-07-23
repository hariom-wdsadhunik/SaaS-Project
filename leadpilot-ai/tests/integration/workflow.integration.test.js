const { app, request, getAuthToken, setupTestData } = require('./integration.setup');

describe('End-to-End Business Workflow Integration Test (Step 5)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should execute full CRM business lifecycle: Lead -> Task -> Appointment -> Deal -> Closed Won -> Report', async () => {
    // 1. Create Lead
    const leadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        phone: '9988776655',
        name: 'Workflow Buyer',
        budget: '2.5 Cr',
        location: 'Golf Course Road, Gurgaon',
        source: 'website',
        status: 'new'
      });

    expect(leadRes.statusCode).toBe(201);
    const leadId = leadRes.body.id;
    expect(leadId).toBeDefined();

    // 2. Schedule Task for Lead
    const taskRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Initial Discovery Call',
        lead_id: leadId,
        due_date: new Date().toISOString(),
        status: 'pending'
      });

    expect(taskRes.statusCode).toBe(201);
    const taskId = taskRes.body.id;

    // Complete Task via PATCH
    const taskCompleteRes = await request(app)
      .patch(`/api/tasks/${taskId}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(taskCompleteRes.statusCode).toBe(200);

    // 3. Schedule Appointment (Site Visit) for Lead
    const apptRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Penthouse Site Visit',
        lead_id: leadId,
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        status: 'Scheduled'
      });

    expect(apptRes.statusCode).toBe(201);
    const apptId = apptRes.body.id;

    // Complete Appointment with feedback via PATCH
    const apptCompleteRes = await request(app)
      .patch(`/api/appointments/${apptId}/complete`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        feedback: 'Buyer submitted token amount',
        rating: 5
      });

    expect(apptCompleteRes.statusCode).toBe(200);

    // 4. Create Deal for Lead
    const dealRes = await request(app)
      .post('/api/deals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Penthouse Sale Deal',
        lead_id: leadId,
        deal_value: 25000000,
        deal_stage: 'Negotiation'
      });

    expect(dealRes.statusCode).toBe(201);
    const dealId = dealRes.body.id;

    // Verify Lead status was automatically updated to 'closed'
    const leadCheck = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(leadCheck.body.status).toBe('closed');

    // 5. Close Deal Won
    const dealWonRes = await request(app)
      .patch(`/api/deals/${dealId}/close-won`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Commission received' });

    expect(dealWonRes.statusCode).toBe(200);
    expect(dealWonRes.body.deal_stage).toBe('Closed Won');

    // 6. Generate Deals Analytics Report
    const reportRes = await request(app)
      .post('/api/reports/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'deals', format: 'json' });

    expect(reportRes.statusCode).toBe(200);
    expect(reportRes.body.success).toBe(true);
  });
});
