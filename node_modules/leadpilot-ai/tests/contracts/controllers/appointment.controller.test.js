const appointmentsController = require('../../../controllers/appointmentsController');
const repository = require('../../../db');
const { createMockContext } = require('./controller.setup');

describe('Appointment Controller Contract Tests (controllers/appointmentsController.js)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    const ctx = createMockContext();
    req = ctx.req;
    res = ctx.res;
  });

  describe('GET /api/appointments', () => {
    it('should return 200 OK with appointments list', async () => {
      const appointments = [{ id: 'app-1', title: 'Site visit' }];
      jest.spyOn(repository, 'getAppointments').mockResolvedValue(appointments);

      await appointmentsController.getAppointments(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(appointments);
    });
  });

  describe('GET /api/appointments/:id', () => {
    it('should return 200 OK with single appointment details', async () => {
      req.params = { id: 'app-1' };
      const appointment = { id: 'app-1', title: 'Meeting' };
      jest.spyOn(repository, 'getAppointmentById').mockResolvedValue(appointment);

      await appointmentsController.getAppointment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(appointment);
    });

    it('should return 404 Not Found if appointment is not found', async () => {
      req.params = { id: 'app-99' };
      jest.spyOn(repository, 'getAppointmentById').mockResolvedValue(null);

      await appointmentsController.getAppointment(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Appointment not found' });
    });
  });

  describe('POST /api/appointments & complete / cancel', () => {
    it('should return 201 Created and log note when appointment is created', async () => {
      req.body = { title: 'Site Inspection', lead_id: 'lead-1', scheduled_at: '2026-08-01T10:00:00Z' };
      const created = { id: 'app-2', ...req.body };

      jest.spyOn(repository, 'createAppointment').mockResolvedValue(created);
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await appointmentsController.createAppointment(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(created);
      expect(repository.createNote).toHaveBeenCalled();
    });

    it('should complete appointment with feedback and rating', async () => {
      req.params = { id: 'app-1' };
      req.body = { feedback: 'Great property', rating: 5 };
      const completed = { id: 'app-1', status: 'Completed', lead_id: 'lead-1', feedback: 'Great property' };

      jest.spyOn(repository, 'updateAppointment').mockResolvedValue(completed);
      jest.spyOn(repository, 'createNote').mockResolvedValue({});

      await appointmentsController.completeAppointment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(completed);
    });

    it('should cancel appointment with reason', async () => {
      req.params = { id: 'app-1' };
      req.body = { reason: 'Client rescheduled' };
      const cancelled = { id: 'app-1', status: 'Cancelled', notes: 'Client rescheduled' };

      jest.spyOn(repository, 'updateAppointment').mockResolvedValue(cancelled);

      await appointmentsController.cancelAppointment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(cancelled);
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('should delete appointment and return success message', async () => {
      req.params = { id: 'app-1' };
      jest.spyOn(repository, 'deleteAppointment').mockResolvedValue(true);

      await appointmentsController.deleteAppointment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Appointment deleted successfully' });
    });
  });

  describe('Filter & Stats', () => {
    it('should filter upcoming appointments and return stats', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      jest.spyOn(repository, 'getAppointments').mockResolvedValue([
        { id: 'app-1', scheduled_at: futureDate, status: 'Scheduled' }
      ]);

      await appointmentsController.getUpcomingAppointments(req, res);
      expect(res.body).toHaveLength(1);

      jest.spyOn(repository, 'getAppointmentStats').mockResolvedValue({ total: 10 });
      const statsRes = createMockContext().res;
      await appointmentsController.getAppointmentStats(req, statsRes);
      expect(statsRes.body).toEqual({ total: 10 });
    });
  });
});
