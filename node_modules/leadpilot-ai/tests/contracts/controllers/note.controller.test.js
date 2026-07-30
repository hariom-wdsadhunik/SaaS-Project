const notesController = require('../../../controllers/notesController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Note Controller Contract Tests (controllers/notesController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/notes', () => {
    it('should return 200 OK with notes collection', async () => {
      const notes = [{ id: 'note-1', content: 'Client interested' }];
      jest.spyOn(repository, 'getNotes').mockResolvedValue(notes);

      await notesController.getNotes(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(notes);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return 200 OK with single note object', async () => {
      req.params = { id: 'note-1' };
      const note = { id: 'note-1', content: 'Meeting summary' };
      jest.spyOn(repository, 'getNoteById').mockResolvedValue(note);

      await notesController.getNote(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(note);
    });

    it('should return 404 Not Found when note ID does not exist', async () => {
      req.params = { id: 'note-99' };
      jest.spyOn(repository, 'getNoteById').mockResolvedValue(null);

      await notesController.getNote(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('POST /api/notes & POST /api/notes/call-log', () => {
    it('should return 201 Created on new note creation', async () => {
      req.body = { lead_id: 'lead-1', note_type: 'General', content: 'Discussion' };
      const created = { id: 'note-2', ...req.body };
      jest.spyOn(repository, 'createNote').mockResolvedValue(created);

      await notesController.createNote(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(created);
    });

    it('should log call details and update new lead status to contacted', async () => {
      req.body = {
        lead_id: 'lead-1',
        content: 'Call connected',
        call_duration: 120,
        call_outcome: 'Answered',
        sentiment: 'Positive'
      };
      const createdCallNote = { id: 'note-3', note_type: 'Call', ...req.body };
      const lead = { id: 'lead-1', status: 'new' };

      jest.spyOn(repository, 'createNote').mockResolvedValue(createdCallNote);
      jest.spyOn(repository, 'getLeadById').mockResolvedValue(lead);
      jest.spyOn(repository, 'updateLead').mockResolvedValue({});

      await notesController.createCallLog(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdCallNote);
      expect(repository.updateLead).toHaveBeenCalledWith('lead-1', { status: 'contacted' });
    });
  });

  describe('DELETE & Timeline', () => {
    it('should delete note and return success message', async () => {
      req.params = { id: 'note-1' };
      jest.spyOn(repository, 'deleteNote').mockResolvedValue(true);

      await notesController.deleteNote(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Note deleted successfully' });
    });

    it('should compile chronological communication timeline', async () => {
      req.params = { lead_id: 'lead-1' };
      jest.spyOn(repository, 'getNotes').mockResolvedValue([{ id: 'n1', created_at: '2026-07-01' }]);
      jest.spyOn(repository, 'getAppointments').mockResolvedValue([{ id: 'a1', scheduled_at: '2026-07-02' }]);
      jest.spyOn(repository, 'getTasks').mockResolvedValue([{ id: 't1', created_at: '2026-07-03' }]);

      await notesController.getCommunicationTimeline(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(3);
    });
  });
});
