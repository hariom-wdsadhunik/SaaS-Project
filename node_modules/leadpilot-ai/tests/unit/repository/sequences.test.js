const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Sequence Repository & Concurrency Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should create and retrieve a sequence', async () => {
    const seq = await repository.createSequence({
      name: 'Nurture Sequence',
      trigger_type: 'lead_created'
    });
    expect(seq).toHaveProperty('id');
    expect(seq.name).toBe('Nurture Sequence');
  });

  it('should acquire atomic enrollment lease lock and reject concurrent locks', async () => {
    const enrollment = await repository.createSequenceEnrollment({
      id: 'enroll-unit-test-1',
      sequence_id: 'seq-1',
      lead_id: 'lead-1',
      status: 'pending'
    });

    const lockA = await repository.acquireEnrollmentLock(enrollment.id, 120000);
    expect(lockA).not.toBeNull();
    expect(lockA.status).toBe('processing');

    // Concurrent Worker B attempts to lock same enrollment -> Returns null
    const lockB = await repository.acquireEnrollmentLock(enrollment.id, 120000);
    expect(lockB).toBeNull();

    // Release lock
    const released = await repository.releaseEnrollmentLock(enrollment.id, { current_step: 1, status: 'completed' });
    expect(released.status).toBe('completed');
  });

  it('should track step-level idempotency to prevent duplicate side effects', async () => {
    const enrollmentId = 'enroll-test-100';
    const stepIndex = 0;

    expect(await repository.isStepAlreadyProcessed(enrollmentId, stepIndex)).toBe(false);

    await repository.recordProcessedStep({
      enrollment_id: enrollmentId,
      step_index: stepIndex,
      action: 'email',
      idempotency_key: 'seq_1_lead_1_step_0'
    });

    expect(await repository.isStepAlreadyProcessed(enrollmentId, stepIndex)).toBe(true);
  });
});
