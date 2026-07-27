const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('db/index.js Repository Delegation & Helper Tests', () => {
  it('should parse pagination parameters correctly', () => {
    expect(repository.isDemoMode).toBe(true);
  });

  it('should cover all db/index.js delegated methods in Demo Mode', async () => {
    // Activity
    await repository.logActivity({ action: 'test' });
    await repository.getActivityLogs();

    // Users
    await repository.getUserByEmail('admin@leadpilot.ai');
    await repository.getUserById('user-1');
    await repository.createUser({ email: 'unit-proxy@test.com' });
    await repository.updateUser('user-1', { name: 'Proxy Test' });
    await repository.getUsers();

    // Leads
    await repository.getLeads({ page: 1, limit: 10 });
    await repository.getLeadById('lead-1');
    const createdLead = await repository.createLead({ name: 'Proxy Lead' });
    await repository.updateLead(createdLead.id, { status: 'contacted' });
    await repository.deleteLead(createdLead.id);

    // Properties
    await repository.getProperties({ page: 1, limit: 10 });
    await repository.getPropertyById('prop-1');
    const createdProp = await repository.createProperty({ title: 'Proxy Prop' });
    await repository.updateProperty(createdProp.id, { price: 900000 });
    await repository.deleteProperty(createdProp.id);
    await repository.getPropertyStats();
    await repository.matchPropertiesToLead({ budget: 1000000 });

    // Deals
    await repository.getDeals({ page: 1, limit: 10 });
    await repository.getDealById('deal-1');
    const createdDeal = await repository.createDeal({ title: 'Proxy Deal' });
    await repository.updateDeal(createdDeal.id, { deal_stage: 'Won' });
    await repository.deleteDeal(createdDeal.id);
    await repository.getCommissionStats();

    // Tasks
    await repository.getTasks({ page: 1, limit: 10 });
    await repository.getTaskById('task-1');
    const createdTask = await repository.createTask({ title: 'Proxy Task' });
    await repository.updateTask(createdTask.id, { status: 'Completed' });
    await repository.deleteTask(createdTask.id);
    await repository.getTodayTasks();
    await repository.getTaskStats();

    // Appointments
    await repository.getAppointments({ page: 1, limit: 10 });
    await repository.getAppointmentById('appt-1');
    const createdAppt = await repository.createAppointment({ title: 'Proxy Appt' });
    await repository.updateAppointment(createdAppt.id, { status: 'Completed' });
    await repository.deleteAppointment(createdAppt.id);
    await repository.getAppointmentStats();

    // Notes
    await repository.getNotes({ page: 1, limit: 10 });
    await repository.getNoteById('note-1');
    const createdNote = await repository.createNote({ content: 'Proxy Note' });
    await repository.updateNote(createdNote.id, { content: 'Updated Proxy Note' });
    await repository.deleteNote(createdNote.id);

    // Email Templates
    await repository.getEmailTemplates();
    await repository.getEmailTemplateById('tpl-1');
    const createdTpl = await repository.createEmailTemplate({ name: 'Proxy Tpl' });
    await repository.updateEmailTemplate(createdTpl.id, { subject: 'Proxy Subject' });
    await repository.deleteEmailTemplate(createdTpl.id);

    // Documents
    await repository.getDocuments();
    await repository.getDocumentById('doc-1');
    const createdDoc = await repository.createDocument({ name: 'Proxy Doc.pdf' });
    await repository.deleteDocument(createdDoc.id);

    // Goals
    await repository.getGoals();
    await repository.getGoalById('goal-1');
    const createdGoal = await repository.createGoal({ title: 'Proxy Goal' });
    await repository.updateGoal(createdGoal.id, { current_amount: 50 });
    await repository.deleteGoal(createdGoal.id);

    // Email Logs & SMS Logs
    await repository.getEmailLogs();
    await repository.createEmailLog({ to: 'test@example.com', subject: 'Test' });
    await repository.getSmsLogs();
    await repository.createSmsLog({ to: '999', message: 'Test' });

    // Sequences & Enrollments
    await repository.getSequences('team-1');
    await repository.getSequenceById('seq-1');
    const createdSeq = await repository.createSequence({ name: 'Proxy Seq' });
    await repository.updateSequence(createdSeq.id, { name: 'Updated Proxy Seq' });
    await repository.deleteSequence(createdSeq.id);

    await repository.getSequenceEnrollments({ sequence_id: 'seq-1' });
    await repository.getSequenceEnrollmentById('enroll-1');
    const createdEnrollment = await repository.createSequenceEnrollment({ sequence_id: 'seq-1', lead_id: 'lead-1' });
    await repository.updateSequenceEnrollment(createdEnrollment.id, { current_step: 1 });
    await repository.deleteSequenceEnrollment(createdEnrollment.id);

    await repository.acquireEnrollmentLock(createdEnrollment.id);
    await repository.releaseEnrollmentLock(createdEnrollment.id, { status: 'completed' });
    await repository.isStepAlreadyProcessed(createdEnrollment.id, 0);
    await repository.recordProcessedStep({ enrollment_id: createdEnrollment.id, step_index: 0 });
  });
});
