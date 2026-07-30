const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Appointment Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should create an appointment', async () => {
    const appt = await repository.createAppointment({
      title: 'Site Visit',
      scheduled_at: new Date().toISOString(),
      status: 'Scheduled'
    });
    expect(appt).toHaveProperty('id');
    expect(appt.title).toBe('Site Visit');
  });

  it('should get paginated appointments and stats', async () => {
    const result = await repository.getAppointments({ page: 1, limit: 5 });
    const stats = await repository.getAppointmentStats();
    expect(result).toHaveProperty('data');
    expect(stats).toHaveProperty('scheduled');
  });

  it('should update and delete an appointment', async () => {
    const appt = await repository.createAppointment({ title: 'Meeting' });
    const updated = await repository.updateAppointment(appt.id, { status: 'Completed' });
    expect(updated.status).toBe('Completed');

    const deleted = await repository.deleteAppointment(appt.id);
    expect(deleted).toBe(true);
  });
});
