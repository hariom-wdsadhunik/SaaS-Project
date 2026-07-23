const repository = require('../../../db');
const demoStore = require('../../../db/demoStore');

describe('Note Repository Unit Tests', () => {
  beforeEach(async () => {
    await demoStore.seedData();
  });

  it('should create and retrieve notes', async () => {
    const note = await repository.createNote({
      lead_id: 'lead-1',
      content: 'Follow up required after call'
    });
    expect(note).toHaveProperty('id');
    expect(note.content).toBe('Follow up required after call');

    const result = await repository.getNotes({ lead_id: 'lead-1' });
    expect(result).toHaveProperty('data');
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should update and delete a note', async () => {
    const note = await repository.createNote({ content: 'Initial Note' });
    const updated = await repository.updateNote(note.id, { content: 'Updated Note' });
    expect(updated.content).toBe('Updated Note');

    const deleted = await repository.deleteNote(note.id);
    expect(deleted).toBe(true);
  });
});
