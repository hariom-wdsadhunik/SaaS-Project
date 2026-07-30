const demoStore = require('../../../db/demoStore');

describe('Demo Store Extended Coverage Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  // Settings
  it('should retrieve and update settings', async () => {
    const settings = await demoStore.getSettings('user-1');
    expect(settings).toBeDefined();

    const updated = await demoStore.saveSettings('user-1', { dailySummary: true });
    expect(updated).not.toBeNull();
    expect(updated.dailySummary).toBe(true);
  });

  // Goals
  it('should create, retrieve, update, and delete goals', async () => {
    const goal = await demoStore.createGoal({ title: 'Q3 Sales Goal', target_amount: 1000000 });
    expect(goal).toHaveProperty('id');
    expect(goal.title).toBe('Q3 Sales Goal');

    const goals = await demoStore.getGoals({ team_id: goal.team_id });
    expect(Array.isArray(goals)).toBe(true);

    const goalById = await demoStore.getGoalById(goal.id);
    expect(goalById).not.toBeNull();

    const updated = await demoStore.updateGoal(goal.id, { current_amount: 500000 });
    expect(updated.current_amount).toBe(500000);

    const invalidUpdated = await demoStore.updateGoal('invalid-goal-id', { current_amount: 0 });
    expect(invalidUpdated).toBeNull();

    const deleted = await demoStore.deleteGoal(goal.id);
    expect(deleted).toBe(true);

    const invalidDeleted = await demoStore.deleteGoal('invalid-goal-id');
    expect(invalidDeleted).toBe(false);
  });

  // Email Templates
  it('should CRUD email templates', async () => {
    const tpl = await demoStore.createEmailTemplate({ name: 'Follow-up Email', subject: 'Checking in' });
    expect(tpl).toHaveProperty('id');

    const list = await demoStore.getEmailTemplates();
    expect(list.length).toBeGreaterThan(0);

    const single = await demoStore.getEmailTemplateById(tpl.id);
    expect(single).not.toBeNull();

    const updated = await demoStore.updateEmailTemplate(tpl.id, { subject: 'Updated Subject' });
    expect(updated.subject).toBe('Updated Subject');

    const invalidUpdate = await demoStore.updateEmailTemplate('invalid-tpl-id', { subject: 'Test' });
    expect(invalidUpdate).toBeNull();

    const deleted = await demoStore.deleteEmailTemplate(tpl.id);
    expect(deleted).toBe(true);

    const invalidDelete = await demoStore.deleteEmailTemplate('invalid-tpl-id');
    expect(invalidDelete).toBe(false);
  });

  // Documents
  it('should CRUD documents', async () => {
    const doc = await demoStore.createDocument({ name: 'Brochure.pdf', file_url: 'https://example.com/b.pdf' });
    expect(doc).toHaveProperty('id');

    const docs = await demoStore.getDocuments();
    expect(docs.length).toBeGreaterThan(0);

    const single = await demoStore.getDocumentById(doc.id);
    expect(single).not.toBeNull();

    const deleted = await demoStore.deleteDocument(doc.id);
    expect(deleted).toBe(true);

    const invalidDelete = await demoStore.deleteDocument('invalid-doc-id');
    expect(invalidDelete).toBe(false);
  });

  // SMS Logging
  it('should log and retrieve SMS logs', async () => {
    const sms = await demoStore.createSmsLog({ to: '9998887770', message: 'Hello' });
    expect(sms).toHaveProperty('id');

    const smsLogs = await demoStore.getSmsLogs();
    expect(smsLogs.length).toBeGreaterThan(0);
  });

  // Users & Activity Logs
  it('should retrieve users and activity logs with filters', async () => {
    const allUsers = await demoStore.getUsers();
    expect(allUsers.length).toBeGreaterThan(0);

    const teamUsers = await demoStore.getUsers({ team_id: 'team-1' });
    expect(Array.isArray(teamUsers)).toBe(true);

    await demoStore.logActivity({ action: 'login', user_id: 'user-1', team_id: 'team-1' });
    const logs = await demoStore.getActivityLogs();
    expect(logs.length).toBeGreaterThan(0);
  });

  // Sequences & Enrollments Extended
  it('should handle sequence and enrollment deletion and non-existent queries', async () => {
    const seq = await demoStore.createSequence({ name: 'Temp Seq' });
    const seqSingle = await demoStore.getSequenceById(seq.id);
    expect(seqSingle).not.toBeNull();

    const updatedSeq = await demoStore.updateSequence(seq.id, { name: 'Updated Seq' });
    expect(updatedSeq.name).toBe('Updated Seq');

    const deletedSeq = await demoStore.deleteSequence(seq.id);
    expect(deletedSeq).toBe(true);

    const invalidSeqDelete = await demoStore.deleteSequence('invalid-seq');
    expect(invalidSeqDelete).toBe(false);

    const enrollment = await demoStore.createSequenceEnrollment({ sequence_id: 'seq-1', lead_id: 'lead-1' });
    const singleEnrollment = await demoStore.getSequenceEnrollmentById(enrollment.id);
    expect(singleEnrollment).not.toBeNull();

    const enrollmentsList = await demoStore.getSequenceEnrollments({ sequence_id: 'seq-1' });
    expect(enrollmentsList.length).toBeGreaterThan(0);

    const updatedEnrollment = await demoStore.updateSequenceEnrollment(enrollment.id, { current_step: 2 });
    expect(updatedEnrollment.current_step).toBe(2);

    const deletedEnrollment = await demoStore.deleteSequenceEnrollment(enrollment.id);
    expect(deletedEnrollment).toBe(true);

    const invalidEnrollmentDelete = await demoStore.deleteSequenceEnrollment('invalid-enrollment');
    expect(invalidEnrollmentDelete).toBe(false);
  });
});
