const {
  sequenceService,
  getSequences,
  getSequence,
  createSequence,
  updateSequence,
  deleteSequence,
  enrollLeads,
  enrollSingleLead,
  getEnrollments
} = require('../../../services/sequenceService');
const demoStore = require('../../../db/demoStore');
const repository = require('../../../db');
const emailController = require('../../../controllers/emailController');
const smsController = require('../../../controllers/smsController');

describe('Sequence Service Unit Tests (services/sequenceService.js)', () => {
  let req, res, createdSeq;

  beforeEach(async () => {
    await demoStore.seedData();
    createdSeq = await repository.createSequence({
      name: 'Initial Sequence',
      trigger_type: 'lead_created',
      team_id: 'team-1',
      steps: [{ action: 'email', subject: 'Hello' }]
    });

    req = {
      user: { id: 'user-1', team_id: 'team-1' },
      params: {},
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    jest.spyOn(emailController, 'sendToLead').mockResolvedValue({ success: true });
    jest.spyOn(smsController, 'sendToLead').mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should retrieve sequence list and single sequence by ID', async () => {
    await getSequences(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, sequences: expect.any(Array) })
    );

    req.params = { id: createdSeq.id };
    await getSequence(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, sequence: expect.objectContaining({ id: createdSeq.id }) })
    );

    req.params = { id: 'non-existent' };
    const missingRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    await getSequence(req, missingRes);
    expect(missingRes.status).toHaveBeenCalledWith(404);
  });

  it('should create a new sequence with trigger config and steps', async () => {
    req.body = {
      name: 'New Onboarding Drip',
      trigger_type: 'lead_created',
      steps: [{ action: 'email', subject: 'Welcome {{lead_name}}', delay_days: 0 }]
    };

    await createSequence(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        sequence: expect.objectContaining({ name: 'New Onboarding Drip' })
      })
    );
  });

  it('should return 400 when creating sequence without required name or trigger_type', async () => {
    req.body = { description: 'Missing name' };
    await createSequence(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should update and delete sequences', async () => {
    req.params = { id: createdSeq.id };
    req.body = { name: 'Updated Drip' };
    await updateSequence(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, sequence: expect.objectContaining({ name: 'Updated Drip' }) })
    );

    await deleteSequence(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('should replace template variables in string templates', () => {
    const lead = { name: 'Alice', phone: '9998887770', budget: '1 Cr' };
    const text = 'Hello {{lead_name}}, your budget is {{lead_budget}}';

    const result = sequenceService.replaceVariables(text, lead);
    expect(result).toBe('Hello Alice, your budget is 1 Cr');
  });

  it('should enroll lead in sequence and prevent duplicate enrollment', async () => {
    req.body = { sequenceId: createdSeq.id, leadId: 'lead-1' };

    await enrollSingleLead(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        enrollment: expect.objectContaining({ lead_id: 'lead-1', sequence_id: createdSeq.id })
      })
    );

    const duplicateRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    await enrollSingleLead(req, duplicateRes);
    expect(duplicateRes.status).toHaveBeenCalledWith(400);
  });

  it('should enroll multiple leads in bulk', async () => {
    req.body = { sequenceId: createdSeq.id, leadIds: ['lead-1', 'lead-2'] };
    await enrollLeads(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: expect.any(Array),
        failed: expect.any(Array)
      })
    );
  });

  it('should return 400 for bulk enrollLeads when sequenceId or leadIds are invalid', async () => {
    req.body = {};
    await enrollLeads(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should retrieve enrollments for a sequence', async () => {
    req.query = { sequenceId: createdSeq.id };
    await getEnrollments(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ enrollments: expect.any(Array) })
    );
  });

  it('should execute sequence step actions (email, sms, note, update_status, assign)', async () => {
    const lead = { id: 'lead-1', name: 'Bob', phone: '9998887770' };

    // 1. Email step
    const seqEmail = { id: createdSeq.id, steps: [{ action: 'email', subject: 'Hi {{lead_name}}', body: 'Body' }] };
    const enrEmail = { id: 'enr-1', current_step: 0, enrolled_at: new Date(Date.now() - 100000).toISOString() };
    const res1 = await sequenceService.processSequenceStep(enrEmail, seqEmail, lead);
    expect(res1.success).toBe(true);

    // 2. SMS step
    const seqSms = { id: createdSeq.id, steps: [{ action: 'sms', message: 'Hi {{lead_name}}' }] };
    const enrSms = { id: 'enr-2', current_step: 0, enrolled_at: new Date(Date.now() - 100000).toISOString() };
    const res2 = await sequenceService.processSequenceStep(enrSms, seqSms, lead);
    expect(res2.success).toBe(true);

    // 3. Note step
    const seqNote = { id: createdSeq.id, steps: [{ action: 'note', note_content: 'Follow up' }] };
    const enrNote = { id: 'enr-3', current_step: 0, enrolled_at: new Date(Date.now() - 100000).toISOString() };
    const res3 = await sequenceService.processSequenceStep(enrNote, seqNote, lead);
    expect(res3.success).toBe(true);

    // 4. Update status step
    const seqStatus = { id: createdSeq.id, steps: [{ action: 'update_status', status: 'contacted' }] };
    const enrStatus = { id: 'enr-4', current_step: 0, enrolled_at: new Date(Date.now() - 100000).toISOString() };
    const res4 = await sequenceService.processSequenceStep(enrStatus, seqStatus, lead);
    expect(res4.success).toBe(true);

    // 5. Assign step
    const seqAssign = { id: createdSeq.id, steps: [{ action: 'assign', user_id: 'user-1' }] };
    const enrAssign = { id: 'enr-5', current_step: 0, enrolled_at: new Date(Date.now() - 100000).toISOString() };
    const res5 = await sequenceService.processSequenceStep(enrAssign, seqAssign, lead);
    expect(res5.success).toBe(true);
  });

  it('should skip step when step is already processed (isStepAlreadyProcessed = true)', async () => {
    const lead = { id: 'lead-1' };
    const seq = { id: createdSeq.id, steps: [{ action: 'email', subject: 'Hi' }] };
    const enr = { id: 'enr-proc', current_step: 0, enrolled_at: new Date().toISOString() };

    jest.spyOn(repository, 'isStepAlreadyProcessed').mockResolvedValueOnce(true);
    const res = await sequenceService.processSequenceStep(enr, seq, lead);

    expect(res.skipped).toBe(true);
  });

  it('should wait when step delay scheduledAt is in the future', async () => {
    const lead = { id: 'lead-1' };
    const seq = { id: createdSeq.id, steps: [{ action: 'email', delay_hours: 24 }] };
    const enr = { id: 'enr-future', current_step: 0, enrolled_at: new Date().toISOString() };

    const res = await sequenceService.processSequenceStep(enr, seq, lead);
    expect(res.waiting).toBe(true);
  });

  it('should complete enrollment when current step index exceeds step length', async () => {
    const sequence = { id: createdSeq.id, steps: [] };
    const enrollment = { id: 'enr-complete', current_step: 0 };
    const result = await sequenceService.processSequenceStep(enrollment, sequence, { id: 'lead-1' });

    expect(result.success).toBe(true);
    expect(result.completed).toBe(true);
  });

  it('should process active enrollments in processAllEnrollments', async () => {
    const lead = { id: 'lead-1', name: 'Test Lead', phone: '9998887770' };
    const seq = { id: createdSeq.id, steps: [{ action: 'email', subject: 'Hi' }] };

    jest.spyOn(repository, 'getSequenceEnrollments').mockResolvedValueOnce([{ id: 'enr-active', lead_id: 'lead-1', sequence_id: createdSeq.id }]);
    jest.spyOn(repository, 'acquireEnrollmentLock').mockResolvedValueOnce({ id: 'enr-active', lead_id: 'lead-1', sequence_id: createdSeq.id, current_step: 0, enrolled_at: new Date(Date.now() - 100000).toISOString() });
    jest.spyOn(repository, 'getLeadById').mockResolvedValueOnce(lead);
    jest.spyOn(repository, 'getSequenceById').mockResolvedValueOnce(seq);

    await sequenceService.processAllEnrollments();
    expect(repository.acquireEnrollmentLock).toHaveBeenCalled();
  });

  it('should handle missing lead or missing sequence in processAllEnrollments', async () => {
    const spyRelease = jest.spyOn(repository, 'releaseEnrollmentLock').mockResolvedValue(true);
    jest.spyOn(repository, 'getSequenceEnrollments').mockResolvedValueOnce([{ id: 'enr-missing', lead_id: 'l-99', sequence_id: 's-99' }]);
    jest.spyOn(repository, 'acquireEnrollmentLock').mockResolvedValueOnce({ id: 'enr-missing', lead_id: 'l-99', sequence_id: 's-99' });
    jest.spyOn(repository, 'getLeadById').mockResolvedValueOnce(null);
    jest.spyOn(repository, 'getSequenceById').mockResolvedValueOnce(null);

    await sequenceService.processAllEnrollments();
    expect(spyRelease).toHaveBeenCalled();
  });

  it('should cover catch blocks in sendSequenceEmail, sendSequenceSMS, addSequenceNote, updateLeadStatus, assignLead', async () => {
    const lead = { id: 'lead-1' };
    const step = { action: 'email', subject: 'sub', body: 'body' };
    const stepSms = { action: 'sms', message: 'msg' };
    const stepNote = { action: 'note', note_content: 'note' };

    jest.spyOn(emailController, 'sendToLead').mockRejectedValueOnce(new Error('Email err'));
    await sequenceService.sendSequenceEmail(lead, step, 'key1');

    jest.spyOn(smsController, 'sendToLead').mockRejectedValueOnce(new Error('SMS err'));
    await sequenceService.sendSequenceSMS(lead, stepSms, 'key2');

    jest.spyOn(repository, 'createNote').mockRejectedValueOnce(new Error('Note err'));
    await sequenceService.addSequenceNote(lead, stepNote, { id: 'enr-1' });

    jest.spyOn(repository, 'updateLead').mockRejectedValueOnce(new Error('Lead update err'));
    await sequenceService.updateLeadStatus('lead-1', 'closed');

    jest.spyOn(repository, 'updateLead').mockRejectedValueOnce(new Error('Assign err'));
    await sequenceService.assignLead('lead-1', 'user-1');
  });

  it('should test completeEnrollment and markEnrollmentFailed directly', async () => {
    await sequenceService.completeEnrollment('enr-1');
    await sequenceService.markEnrollmentFailed('enr-1', 'Test Error');
    await sequenceService.updateSequenceStats(createdSeq.id);
  });

  it('should cover error branches in sequence handlers and repository calls', async () => {
    jest.spyOn(repository, 'getSequenceEnrollments').mockRejectedValueOnce(new Error('Enrollments Error'));
    req.query = { sequenceId: 'seq-1' };
    await getEnrollments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    jest.spyOn(repository, 'createSequence').mockRejectedValueOnce(new Error('Create error'));
    req.body = { name: 'Test', trigger_type: 'lead_created' };
    const errRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    await createSequence(req, errRes);
    expect(errRes.status).toHaveBeenCalledWith(400);

    jest.spyOn(repository, 'createSequenceEnrollment').mockRejectedValueOnce(new Error('Enroll error'));
    req.body = { sequenceId: 'seq-1', leadId: 'lead-99' };
    const errRes2 = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    await enrollSingleLead(req, errRes2);
    expect(errRes2.status).toHaveBeenCalledWith(400);
  });
});
