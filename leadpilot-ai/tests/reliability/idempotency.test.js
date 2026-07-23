const { app, request, getAuthToken, setupTestData } = require('./reliability.setup');
const repository = require('../../db');

describe('Idempotency & Duplicate Execution Tests (Step 4)', () => {
  let token;

  beforeEach(async () => {
    await setupTestData();
    token = await getAuthToken();
  });

  it('should prevent duplicate enrollments for the same lead in a sequence', async () => {
    const res1 = await request(app)
      .post('/api/sequences/enroll')
      .set('Authorization', `Bearer ${token}`)
      .send({ sequenceId: 'seq-1', leadId: 'lead-1' });

    expect(res1.statusCode).toBe(200);

    // Duplicate enrollment attempt
    const res2 = await request(app)
      .post('/api/sequences/enroll')
      .set('Authorization', `Bearer ${token}`)
      .send({ sequenceId: 'seq-1', leadId: 'lead-1' });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.error).toBe('Lead already enrolled in this sequence');
  });

  it('should maintain idempotent lead status update results when repeated', async () => {
    const leadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '9998881111', name: 'Idempotent Lead' });

    const leadId = leadRes.body.id;

    // First update
    const update1 = await request(app)
      .patch(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'contacted' });

    // Second identical update
    const update2 = await request(app)
      .patch(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'contacted' });

    expect(update1.body.status).toBe('contacted');
    expect(update2.body.status).toBe('contacted');
  });

  it('should record processed sequence steps idempotently', async () => {
    const enrollmentId = 'enr-test-100';
    const stepIndex = 0;

    const isProcessedBefore = await repository.isStepAlreadyProcessed(enrollmentId, stepIndex);
    expect(isProcessedBefore).toBe(false);

    await repository.recordProcessedStep({ enrollment_id: enrollmentId, step_index: stepIndex });

    const isProcessedAfter = await repository.isStepAlreadyProcessed(enrollmentId, stepIndex);
    expect(isProcessedAfter).toBe(true);
  });
});
