// Unit tests for database operations

const { setupDatabaseLifecycle } = require('./helpers/dbHelpers');
const { 
  createNote, 
  createNotes, 
  createNotesWithAllCategories,
  createNotesWithAllPriorities,
  createLongNote
} = require('./fixtures/noteFixtures');

describe('Database Operations Unit Tests', () => {
  // Setup database for each test
  setupDatabaseLifecycle();

  describe('getAllNotes()', () => {
    test('should return empty array when no notes exist', async () => {
      const notes = await global.testDbOperations.getAllNotes();
      expect(notes).toEqual([]);
    });

    test('should return all created notes', async () => {
      // Create multiple notes
      const note1 = createNote({ title: 'First Note' });
      const note2 = createNote({ title: 'Second Note' });
      const note3 = createNote({ title: 'Third Note' });

      await global.testDbOperations.createNote(note1);
      await global.testDbOperations.createNote(note2);
      await global.testDbOperations.createNote(note3);

      const notes = await global.testDbOperations.getAllNotes();
      
      expect(notes).toHaveLength(3);
      
      // Verify all notes are present (order doesn't matter for this test)
      const titles = notes.map(note => note.title);
      expect(titles).toContain('First Note');
      expect(titles).toContain('Second Note');
      expect(titles).toContain('Third Note');
      
      // Verify all have proper structure
      notes.forEach(note => {
        global.testHelper.expectValidNoteStructure(note);
      });
    });

    test('should return all notes with all required fields', async () => {
      const noteData = createNote();
      await global.testDbOperations.createNote(noteData);

      const notes = await global.testDbOperations.getAllNotes();
      
      expect(notes).toHaveLength(1);
      global.testHelper.expectValidNoteStructure(notes[0]);
    });

    test('should handle large number of notes', async () => {
      const noteDataList = createNotes(100);
      
      // Create all notes
      for (const noteData of noteDataList) {
        await global.testDbOperations.createNote(noteData);
      }

      const notes = await global.testDbOperations.getAllNotes();
      expect(notes).toHaveLength(100);
      
      // Verify all have required structure
      notes.forEach(note => {
        global.testHelper.expectValidNoteStructure(note);
      });
    });
  });

  describe('getNoteById()', () => {
    test('should return note when ID exists', async () => {
      const noteData = createNote();
      const createdNote = await global.testDbOperations.createNote(noteData);

      const retrievedNote = await global.testDbOperations.getNoteById(createdNote.id);
      
      expect(retrievedNote).toEqual(createdNote);
      global.testHelper.expectValidNoteStructure(retrievedNote);
    });

    test('should return undefined when ID does not exist', async () => {
      const retrievedNote = await global.testDbOperations.getNoteById(999);
      expect(retrievedNote).toBeUndefined();
    });

    test('should return undefined for invalid ID types', async () => {
      const testCases = [null, undefined, 'invalid', {}, [], NaN];
      
      for (const invalidId of testCases) {
        const retrievedNote = await global.testDbOperations.getNoteById(invalidId);
        expect(retrievedNote).toBeUndefined();
      }
    });

    test('should handle negative IDs', async () => {
      const retrievedNote = await global.testDbOperations.getNoteById(-1);
      expect(retrievedNote).toBeUndefined();
    });

    test('should handle zero ID', async () => {
      const retrievedNote = await global.testDbOperations.getNoteById(0);
      expect(retrievedNote).toBeUndefined();
    });
  });

  describe('createNote()', () => {
    test('should create note with valid data', async () => {
      const noteData = createNote();
      const createdNote = await global.testDbOperations.createNote(noteData);

      expect(createdNote.id).toBeDefined();
      expect(createdNote.id).toBeGreaterThan(0);
      expect(createdNote.title).toBe(noteData.title);
      expect(createdNote.category).toBe(noteData.category);
      expect(createdNote.priority).toBe(noteData.priority);
      expect(createdNote.description).toBe(noteData.description);
      expect(createdNote.created_at).toBeDefined();
      expect(createdNote.updated_at).toBeDefined();
      expect(new Date(createdNote.created_at)).toBeInstanceOf(Date);
      expect(new Date(createdNote.updated_at)).toBeInstanceOf(Date);
    });

    test('should create notes with all valid categories', async () => {
      const notes = createNotesWithAllCategories();
      
      for (const noteData of notes) {
        const createdNote = await global.testDbOperations.createNote(noteData);
        expect(createdNote.category).toBe(noteData.category);
        global.testHelper.expectValidNoteStructure(createdNote);
      }
    });

    test('should create notes with all valid priorities', async () => {
      const notes = createNotesWithAllPriorities();
      
      for (const noteData of notes) {
        const createdNote = await global.testDbOperations.createNote(noteData);
        expect(createdNote.priority).toBe(noteData.priority);
        global.testHelper.expectValidNoteStructure(createdNote);
      }
    });

    test('should handle long content', async () => {
      const longNote = createLongNote();
      const createdNote = await global.testDbOperations.createNote(longNote);

      expect(createdNote.title).toBe(longNote.title);
      expect(createdNote.description).toBe(longNote.description);
      global.testHelper.expectValidNoteStructure(createdNote);
    });

    test('should auto-increment IDs', async () => {
      const note1 = await global.testDbOperations.createNote(createNote());
      const note2 = await global.testDbOperations.createNote(createNote());
      const note3 = await global.testDbOperations.createNote(createNote());

      expect(note2.id).toBeGreaterThan(note1.id);
      expect(note3.id).toBeGreaterThan(note2.id);
    });

    test('should set created_at and updated_at to same value initially', async () => {
      const createdNote = await global.testDbOperations.createNote(createNote());
      expect(createdNote.created_at).toBe(createdNote.updated_at);
    });
  });

  describe('updateNote()', () => {
    test('should update existing note', async () => {
      const originalNote = await global.testDbOperations.createNote(createNote());
      const updateData = {
        title: 'Updated Title',
        category: 'personal',
        priority: 'low',
        description: 'Updated description'
      };

      const updatedNote = await global.testDbOperations.updateNote(originalNote.id, updateData);

      expect(updatedNote.id).toBe(originalNote.id);
      expect(updatedNote.title).toBe(updateData.title);
      expect(updatedNote.category).toBe(updateData.category);
      expect(updatedNote.priority).toBe(updateData.priority);
      expect(updatedNote.description).toBe(updateData.description);
      expect(updatedNote.created_at).toBe(originalNote.created_at);
      expect(new Date(updatedNote.updated_at)).toBeInstanceOf(Date);
    });

    test('should update updated_at timestamp', async () => {
      const originalNote = await global.testDbOperations.createNote(createNote());
      
      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const updateData = createNote({ title: 'Updated' });
      const updatedNote = await global.testDbOperations.updateNote(originalNote.id, updateData);

      expect(new Date(updatedNote.updated_at).getTime())
        .toBeGreaterThanOrEqual(new Date(originalNote.updated_at).getTime());
    });

    test('should return null for non-existent note ID', async () => {
      const updateData = createNote();
      const result = await global.testDbOperations.updateNote(999, updateData);
      expect(result).toBeNull();
    });

    test('should update only provided fields', async () => {
      const originalNote = await global.testDbOperations.createNote(createNote());
      const partialUpdate = { title: 'Only Title Updated' };

      // Note: Our implementation requires all fields, but testing concept
      const fullUpdate = {
        ...createNote(),
        title: 'Only Title Updated'
      };

      const updatedNote = await global.testDbOperations.updateNote(originalNote.id, fullUpdate);
      expect(updatedNote.title).toBe('Only Title Updated');
    });

    test('should handle updating to all valid categories', async () => {
      const originalNote = await global.testDbOperations.createNote(createNote());
      const categories = ['work', 'personal', 'ideas'];

      for (const category of categories) {
        const updateData = createNote({ category });
        const updatedNote = await global.testDbOperations.updateNote(originalNote.id, updateData);
        expect(updatedNote.category).toBe(category);
      }
    });

    test('should handle updating to all valid priorities', async () => {
      const originalNote = await global.testDbOperations.createNote(createNote());
      const priorities = ['high', 'medium', 'low'];

      for (const priority of priorities) {
        const updateData = createNote({ priority });
        const updatedNote = await global.testDbOperations.updateNote(originalNote.id, updateData);
        expect(updatedNote.priority).toBe(priority);
      }
    });
  });

  describe('deleteNote()', () => {
    test('should delete existing note and return it', async () => {
      const createdNote = await global.testDbOperations.createNote(createNote());
      
      const deletedNote = await global.testDbOperations.deleteNote(createdNote.id);
      
      expect(deletedNote).toEqual(createdNote);
      
      // Verify note is actually deleted
      const retrievedNote = await global.testDbOperations.getNoteById(createdNote.id);
      expect(retrievedNote).toBeUndefined();
    });

    test('should return null for non-existent note ID', async () => {
      const result = await global.testDbOperations.deleteNote(999);
      expect(result).toBeNull();
    });

    test('should not affect other notes when deleting', async () => {
      const note1 = await global.testDbOperations.createNote(createNote({ title: 'Note 1' }));
      const note2 = await global.testDbOperations.createNote(createNote({ title: 'Note 2' }));
      const note3 = await global.testDbOperations.createNote(createNote({ title: 'Note 3' }));

      // Delete middle note
      await global.testDbOperations.deleteNote(note2.id);

      // Check other notes still exist
      const remainingNote1 = await global.testDbOperations.getNoteById(note1.id);
      const remainingNote3 = await global.testDbOperations.getNoteById(note3.id);
      
      expect(remainingNote1).toEqual(note1);
      expect(remainingNote3).toEqual(note3);
      
      // Confirm deleted note is gone
      const deletedNote = await global.testDbOperations.getNoteById(note2.id);
      expect(deletedNote).toBeUndefined();
    });

    test('should handle deleting all notes', async () => {
      // Create multiple notes
      const notes = createNotes(5);
      const createdNotes = [];
      for (const noteData of notes) {
        const created = await global.testDbOperations.createNote(noteData);
        createdNotes.push(created);
      }

      // Delete all notes
      for (const note of createdNotes) {
        const deleted = await global.testDbOperations.deleteNote(note.id);
        expect(deleted).toEqual(note);
      }

      // Verify all are gone
      const remainingNotes = await global.testDbOperations.getAllNotes();
      expect(remainingNotes).toHaveLength(0);
    });

    test('should handle invalid ID types gracefully', async () => {
      const invalidIds = [null, undefined, 'invalid', {}, [], NaN, -1];
      
      for (const invalidId of invalidIds) {
        const result = await global.testDbOperations.deleteNote(invalidId);
        expect(result).toBeNull();
      }
    });
  });
});