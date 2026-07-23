const {
  getSequences,
  getSequence,
  createSequence,
  updateSequence,
  deleteSequence,
  enrollSingleLead,
  enrollLeads,
  getEnrollments
} = require('../../../services/sequenceService');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Sequence Controller Contract Tests (services/sequenceService.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/sequences', () => {
    it('should return 200 OK with sequence list', async () => {
      const mockSequences = [{ id: 'seq-1', name: 'Welcome Drip' }];
      jest.spyOn(repository, 'getSequences').mockResolvedValue(mockSequences);

      await getSequences(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true, sequences: mockSequences });
    });
  });

  describe('GET /api/sequences/:id', () => {
    it('should return 200 OK with sequence details', async () => {
      req.params = { id: 'seq-1' };
      const sequence = { id: 'seq-1', name: 'Welcome Drip' };
      jest.spyOn(repository, 'getSequenceById').mockResolvedValue(sequence);

      await getSequence(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true, sequence });
    });

    it('should return 404 Not Found when sequence does not exist', async () => {
      req.params = { id: 'seq-missing' };
      jest.spyOn(repository, 'getSequenceById').mockResolvedValue(null);

      await getSequence(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ success: false, error: 'Sequence not found' });
    });
  });

  describe('POST /api/sequences', () => {
    it('should return 201 Created on valid sequence creation', async () => {
      req.body = { name: 'Drip 1', trigger_type: 'lead_created', steps: [] };
      const created = { id: 'seq-2', ...req.body };
      jest.spyOn(repository, 'createSequence').mockResolvedValue(created);

      await createSequence(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ success: true, sequence: created });
    });

    it('should return 400 Bad Request when required name or trigger_type is missing', async () => {
      req.body = { description: 'Missing name' };

      await createSequence(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ success: false, error: 'Name and trigger type are required' });
    });
  });

  describe('Enrollments (single & bulk)', () => {
    it('should enroll lead in sequence and return 200 OK', async () => {
      req.body = { sequenceId: 'seq-1', leadId: 'lead-1' };
      const mockEnrollment = { id: 'enr-1', sequence_id: 'seq-1', lead_id: 'lead-1' };

      jest.spyOn(repository, 'createSequenceEnrollment').mockResolvedValue(mockEnrollment);

      await enrollSingleLead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true, enrollment: mockEnrollment });
    });

    it('should enroll multiple leads in bulk', async () => {
      req.body = { sequenceId: 'seq-1', leadIds: ['lead-1', 'lead-2'] };
      jest.spyOn(repository, 'createSequenceEnrollment')
        .mockResolvedValueOnce({ id: 'enr-1', lead_id: 'lead-1' })
        .mockResolvedValueOnce({ id: 'enr-2', lead_id: 'lead-2' });

      await enrollLeads(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: ['lead-1', 'lead-2'],
        failed: []
      });
    });
  });
});
