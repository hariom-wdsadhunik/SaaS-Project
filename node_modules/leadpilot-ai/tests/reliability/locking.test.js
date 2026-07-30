const { setupTestData } = require('./reliability.setup');
const repository = require('../../db');

describe('Sequence Worker & Lease Locking Tests (Step 5)', () => {
  beforeEach(async () => {
    await setupTestData();
  });

  it('should acquire lease lock atomically and block concurrent workers', async () => {
    const enrollment = await repository.createSequenceEnrollment({
      lead_id: 'lead-1',
      sequence_id: 'seq-1',
      status: 'active'
    });

    // Worker 1 acquires lock
    const lockWorker1 = await repository.acquireEnrollmentLock(enrollment.id, 60000);
    expect(lockWorker1).not.toBeNull();
    expect(lockWorker1.status).toBe('processing');

    // Worker 2 attempts lock while Worker 1 holds lease -> expect null
    const lockWorker2 = await repository.acquireEnrollmentLock(enrollment.id, 60000);
    expect(lockWorker2).toBeNull();
  });

  it('should release lease lock and allow subsequent worker lock acquisition', async () => {
    const enrollment = await repository.createSequenceEnrollment({
      lead_id: 'lead-2',
      sequence_id: 'seq-1',
      status: 'active'
    });

    // Worker 1 acquires lock
    const lock1 = await repository.acquireEnrollmentLock(enrollment.id, 60000);
    expect(lock1).not.toBeNull();

    // Worker 1 finishes and releases lock
    await repository.releaseEnrollmentLock(enrollment.id, { status: 'active', current_step: 1 });

    // Worker 2 attempts lock after release -> succeeds
    const lock2 = await repository.acquireEnrollmentLock(enrollment.id, 60000);
    expect(lock2).not.toBeNull();
    expect(lock2.status).toBe('processing');
  });

  it('should recover lease lock after expiration duration', async () => {
    const enrollment = await repository.createSequenceEnrollment({
      lead_id: 'lead-3',
      sequence_id: 'seq-1',
      status: 'active'
    });

    // Worker 1 acquires lock with short 10ms expiration
    const lock1 = await repository.acquireEnrollmentLock(enrollment.id, 10);
    expect(lock1).not.toBeNull();

    // Wait 20ms for lock expiration
    await new Promise((r) => setTimeout(r, 20));

    // Worker 2 acquires lock after timeout expiry -> succeeds
    const lock2 = await repository.acquireEnrollmentLock(enrollment.id, 60000);
    expect(lock2).not.toBeNull();
  });
});
