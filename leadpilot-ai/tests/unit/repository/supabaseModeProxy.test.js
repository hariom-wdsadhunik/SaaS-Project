describe('db/index.js Production Supabase Mode Mock Unit Tests', () => {
  let repository;
  let mockSupabase;

  beforeEach(() => {
    jest.resetModules();

    const createMockQueryBuilder = () => {
      const builder = {
        select: jest.fn(() => builder),
        insert: jest.fn(() => builder),
        update: jest.fn(() => builder),
        delete: jest.fn(() => builder),
        eq: jest.fn(() => builder),
        neq: jest.fn(() => builder),
        gte: jest.fn(() => builder),
        lte: jest.fn(() => builder),
        ilike: jest.fn(() => builder),
        or: jest.fn(() => builder),
        order: jest.fn(() => builder),
        range: jest.fn(() => builder),
        single: jest.fn().mockResolvedValue({ data: { id: 'mock-id', name: 'Mock Data' }, error: null }),
        then: jest.fn((resolve) => resolve({ data: [{ id: 'mock-id', name: 'Mock Data' }], count: 1, error: null }))
      };
      return builder;
    };

    mockSupabase = {
      from: jest.fn(() => createMockQueryBuilder()),
      rpc: jest.fn().mockResolvedValue({ data: { id: 'mock-lock-id' }, error: null })
    };

    jest.doMock('../../../db/supabase', () => ({
      supabase: mockSupabase,
      isDemoMode: false
    }));

    repository = require('../../../db');
  });

  it('should route Activity Logs through Supabase', async () => {
    await repository.logActivity({ action: 'prod_test' });
    expect(mockSupabase.from).toHaveBeenCalledWith('activity_logs');

    await repository.getActivityLogs({ team_id: 'team-1' });
    expect(mockSupabase.from).toHaveBeenCalledWith('activity_logs');
  });

  it('should route Auth & Users through Supabase', async () => {
    await repository.getUserByEmail('prod@test.com');
    expect(mockSupabase.from).toHaveBeenCalledWith('users');

    await repository.getUserById('user-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('users');

    await repository.createUser({ email: 'prod@test.com' });
    expect(mockSupabase.from).toHaveBeenCalledWith('users');

    await repository.updateUser('user-prod-1', { name: 'Prod Name' });
    expect(mockSupabase.from).toHaveBeenCalledWith('users');

    await repository.getUsers({ team_id: 'team-1' });
    expect(mockSupabase.from).toHaveBeenCalledWith('users');
  });

  it('should route Leads through Supabase', async () => {
    await repository.getLeads({ search: 'prod', status: 'new', page: 1, limit: 10 });
    expect(mockSupabase.from).toHaveBeenCalledWith('leads');

    await repository.getLeadById('lead-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('leads');

    await repository.createLead({ name: 'Prod Lead' });
    expect(mockSupabase.from).toHaveBeenCalledWith('leads');

    await repository.updateLead('lead-prod-1', { status: 'qualified' });
    expect(mockSupabase.from).toHaveBeenCalledWith('leads');

    await repository.deleteLead('lead-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('leads');
  });

  it('should route Properties through Supabase', async () => {
    await repository.getProperties({ city: 'Delhi', minPrice: 1000, maxPrice: 50000 });
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');

    await repository.getPropertyById('prop-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');

    await repository.createProperty({ title: 'Prod Villa' });
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');

    await repository.updateProperty('prop-prod-1', { price: 2000000 });
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');

    await repository.deleteProperty('prop-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');

    await repository.getPropertyStats();
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');

    await repository.matchPropertiesToLead({ budget: 5000000, city: 'Delhi' });
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');
  });

  it('should route Tasks through Supabase', async () => {
    await repository.getTasks({ status: 'Pending' });
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');

    await repository.getTaskById('task-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');

    await repository.createTask({ title: 'Prod Task' });
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');

    await repository.updateTask('task-prod-1', { status: 'Completed' });
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');

    await repository.deleteTask('task-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');

    await repository.getTodayTasks();
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');

    await repository.getTaskStats();
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
  });

  it('should route Appointments through Supabase', async () => {
    await repository.getAppointments({ status: 'Scheduled' });
    expect(mockSupabase.from).toHaveBeenCalledWith('appointments');

    await repository.getAppointmentById('appt-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('appointments');

    await repository.createAppointment({ title: 'Prod Appt' });
    expect(mockSupabase.from).toHaveBeenCalledWith('appointments');

    await repository.updateAppointment('appt-prod-1', { status: 'Completed' });
    expect(mockSupabase.from).toHaveBeenCalledWith('appointments');

    await repository.deleteAppointment('appt-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('appointments');

    await repository.getAppointmentStats();
    expect(mockSupabase.from).toHaveBeenCalledWith('appointments');
  });

  it('should route Deals through Supabase', async () => {
    await repository.getDeals({ deal_stage: 'Won' });
    expect(mockSupabase.from).toHaveBeenCalledWith('deals');

    await repository.getDealById('deal-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('deals');

    await repository.createDeal({ title: 'Prod Deal' });
    expect(mockSupabase.from).toHaveBeenCalledWith('deals');

    await repository.updateDeal('deal-prod-1', { deal_stage: 'Won' });
    expect(mockSupabase.from).toHaveBeenCalledWith('deals');

    await repository.deleteDeal('deal-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('deals');

    await repository.getCommissionStats();
    expect(mockSupabase.from).toHaveBeenCalledWith('deals');
  });

  it('should route Notes through Supabase', async () => {
    await repository.getNotes({ lead_id: 'lead-1' });
    expect(mockSupabase.from).toHaveBeenCalledWith('notes');

    await repository.getNoteById('note-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('notes');

    await repository.createNote({ content: 'Prod Note' });
    expect(mockSupabase.from).toHaveBeenCalledWith('notes');

    await repository.updateNote('note-prod-1', { content: 'Updated Prod Note' });
    expect(mockSupabase.from).toHaveBeenCalledWith('notes');

    await repository.deleteNote('note-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('notes');
  });

  it('should route Email Templates through Supabase', async () => {
    await repository.getEmailTemplates();
    expect(mockSupabase.from).toHaveBeenCalledWith('email_templates');

    await repository.getEmailTemplateById('tpl-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('email_templates');

    await repository.createEmailTemplate({ name: 'Prod Tpl' });
    expect(mockSupabase.from).toHaveBeenCalledWith('email_templates');

    await repository.updateEmailTemplate('tpl-prod-1', { subject: 'Prod Subject' });
    expect(mockSupabase.from).toHaveBeenCalledWith('email_templates');

    await repository.deleteEmailTemplate('tpl-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('email_templates');
  });

  it('should route Documents through Supabase', async () => {
    await repository.getDocuments();
    expect(mockSupabase.from).toHaveBeenCalledWith('documents');

    await repository.getDocumentById('doc-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('documents');

    await repository.createDocument({ name: 'Prod Document.pdf' });
    expect(mockSupabase.from).toHaveBeenCalledWith('documents');

    await repository.deleteDocument('doc-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('documents');
  });

  it('should route Goals through Supabase', async () => {
    await repository.getGoals({ team_id: 'team-1' });
    expect(mockSupabase.from).toHaveBeenCalledWith('goals');

    await repository.getGoalById('goal-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('goals');

    await repository.createGoal({ title: 'Prod Goal' });
    expect(mockSupabase.from).toHaveBeenCalledWith('goals');

    await repository.updateGoal('goal-prod-1', { current_amount: 100 });
    expect(mockSupabase.from).toHaveBeenCalledWith('goals');

    await repository.deleteGoal('goal-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('goals');
  });

  it('should route Sequences, Enrollments, Lease Locking & Idempotency through Supabase', async () => {
    await repository.getSequences('team-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('sequences');

    await repository.getSequenceById('seq-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('sequences');

    await repository.createSequence({ name: 'Prod Seq' });
    expect(mockSupabase.from).toHaveBeenCalledWith('sequences');

    await repository.updateSequence('seq-prod-1', { name: 'Updated Prod Seq' });
    expect(mockSupabase.from).toHaveBeenCalledWith('sequences');

    await repository.deleteSequence('seq-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('sequences');

    await repository.getSequenceEnrollments({ sequence_id: 'seq-1' });
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_enrollments');

    await repository.getSequenceEnrollmentById('enroll-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_enrollments');

    await repository.createSequenceEnrollment({ sequence_id: 'seq-1' });
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_enrollments');

    await repository.updateSequenceEnrollment('enroll-prod-1', { status: 'completed' });
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_enrollments');

    await repository.deleteSequenceEnrollment('enroll-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_enrollments');

    await repository.acquireEnrollmentLock('enroll-prod-1');
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_enrollments');

    await repository.releaseEnrollmentLock('enroll-prod-1', { status: 'completed' });
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_enrollments');

    await repository.isStepAlreadyProcessed('enroll-prod-1', 0);
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_step_logs');

    await repository.recordProcessedStep({ enrollment_id: 'enroll-prod-1', step_index: 0 });
    expect(mockSupabase.from).toHaveBeenCalledWith('sequence_step_logs');
  });
});
