// API Integration tests using Supertest

const request = require('supertest');
const { createTestApp, closeTestApp } = require('./helpers/testApp');
const { 
  createNote, 
  validNotes, 
  invalidNotes, 
  testScenarios,
  validationErrors
} = require('./fixtures/noteFixtures');

describe('API Integration Tests', () => {
  let app, db, dbOperations;

  beforeEach(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    db = testApp.db;
    dbOperations = testApp.dbOperations;
  });

  afterEach(async () => {
    if (db) {
      await closeTestApp(db);
    }
  });

  describe('Health and Info Endpoints', () => {
    test('GET /health should return service status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Notes microservice is running'
      });
    });

    test('GET / should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('notes');
    });
  });

  describe('GET /api/notes', () => {
    test('should return empty array when no notes exist', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      global.testHelper.expectSuccessResponse(response);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all notes when notes exist', async () => {
      // Create test notes
      const note1 = await dbOperations.createNote(createNote({ title: 'Note 1' }));
      const note2 = await dbOperations.createNote(createNote({ title: 'Note 2' }));

      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      global.testHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      
      // Verify structure of returned notes
      response.body.data.forEach(note => {
        global.testHelper.expectValidNoteStructure(note);
      });
    });

    test('should return notes with proper structure', async () => {
      const noteData = validNotes.work;
      await dbOperations.createNote(noteData);

      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      const note = response.body.data[0];
      
      expect(note.title).toBe(noteData.title);
      expect(note.category).toBe(noteData.category);
      expect(note.priority).toBe(noteData.priority);
      expect(note.description).toBe(noteData.description);
      global.testHelper.expectValidNoteStructure(note);
    });
  });

  describe('GET /api/notes/:id', () => {
    test('should return specific note when ID exists', async () => {
      const noteData = validNotes.personal;
      const createdNote = await dbOperations.createNote(noteData);

      const response = await request(app)
        .get(`/api/notes/${createdNote.id}`)
        .expect(200);

      global.testHelper.expectSuccessResponse(response);
      expect(response.body.data).toEqual(createdNote);
    });

    test('should return 404 when note ID does not exist', async () => {
      const response = await request(app)
        .get('/api/notes/999')
        .expect(404);

      global.testHelper.expectErrorResponse(response, 'Note not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const invalidIds = ['abc', 'null', 'undefined'];
      
      for (const invalidId of invalidIds) {
        const response = await request(app)
          .get(`/api/notes/${invalidId}`)
          .expect(400);

        global.testHelper.expectErrorResponse(response, 'Invalid note ID');
      }
    });

    test('should handle empty ID in URL', async () => {
      // Empty ID would result in /api/notes/ which matches different route
      const response = await request(app)
        .get('/api/notes/')
        .expect(200); // This hits the GET /api/notes route instead

      global.testHelper.expectSuccessResponse(response);
    });

    test('should handle negative IDs', async () => {
      const response = await request(app)
        .get('/api/notes/-1')
        .expect(404);

      global.testHelper.expectErrorResponse(response, 'Note not found');
    });
  });

  describe('POST /api/notes', () => {
    test('should create note with valid data', async () => {
      const noteData = validNotes.work;

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(201);

      global.testHelper.expectSuccessResponse(response);
      expect(response.body.message).toBe('Note created successfully');
      
      const createdNote = response.body.data;
      expect(createdNote.id).toBeDefined();
      expect(createdNote.title).toBe(noteData.title);
      expect(createdNote.category).toBe(noteData.category);
      expect(createdNote.priority).toBe(noteData.priority);
      expect(createdNote.description).toBe(noteData.description);
      global.testHelper.expectValidNoteStructure(createdNote);
    });

    test('should create notes with all valid categories', async () => {
      const categories = ['work', 'personal', 'ideas'];
      
      for (const category of categories) {
        const noteData = createNote({ category });
        
        const response = await request(app)
          .post('/api/notes')
          .send(noteData)
          .expect(201);

        expect(response.body.data.category).toBe(category);
      }
    });

    test('should create notes with all valid priorities', async () => {
      const priorities = ['high', 'medium', 'low'];
      
      for (const priority of priorities) {
        const noteData = createNote({ priority });
        
        const response = await request(app)
          .post('/api/notes')
          .send(noteData)
          .expect(201);

        expect(response.body.data.priority).toBe(priority);
      }
    });

    test('should trim whitespace from title and description', async () => {
      const noteData = createNote({
        title: '  Whitespace Title  ',
        description: '  Whitespace Description  '
      });

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(201);

      expect(response.body.data.title).toBe('Whitespace Title');
      expect(response.body.data.description).toBe('Whitespace Description');
    });

    test('should return 400 for missing required fields', async () => {
      const testCases = [
        { note: invalidNotes.missingTitle, expectedError: validationErrors.titleRequired },
        { note: invalidNotes.missingCategory, expectedError: validationErrors.categoryInvalid },
        { note: invalidNotes.missingPriority, expectedError: validationErrors.priorityInvalid },
        { note: invalidNotes.missingDescription, expectedError: validationErrors.descriptionRequired }
      ];

      for (const { note, expectedError } of testCases) {
        const response = await request(app)
          .post('/api/notes')
          .send(note)
          .expect(400);

        global.testHelper.expectErrorResponse(response, 'Validation failed');
        expect(response.body.errors).toContain(expectedError);
      }
    });

    test('should return 400 for empty required fields', async () => {
      const testCases = [
        invalidNotes.emptyTitle,
        invalidNotes.emptyDescription,
        invalidNotes.whitespaceTitle,
        invalidNotes.whitespaceDescription
      ];

      for (const noteData of testCases) {
        const response = await request(app)
          .post('/api/notes')
          .send(noteData)
          .expect(400);

        global.testHelper.expectErrorResponse(response, 'Validation failed');
      }
    });

    test('should return 400 for invalid category values', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send(invalidNotes.invalidCategory)
        .expect(400);

      global.testHelper.expectErrorResponse(response, 'Validation failed');
      expect(response.body.errors).toContain(validationErrors.categoryInvalid);
    });

    test('should return 400 for invalid priority values', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send(invalidNotes.invalidPriority)
        .expect(400);

      global.testHelper.expectErrorResponse(response, 'Validation failed');
      expect(response.body.errors).toContain(validationErrors.priorityInvalid);
    });

    test('should return 400 for malformed JSON', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
  });

  describe('PUT /api/notes/:id', () => {
    test('should update existing note', async () => {
      const originalNote = await dbOperations.createNote(validNotes.work);
      const updateData = validNotes.personal;

      const response = await request(app)
        .put(`/api/notes/${originalNote.id}`)
        .send(updateData)
        .expect(200);

      global.testHelper.expectSuccessResponse(response);
      expect(response.body.message).toBe('Note updated successfully');
      
      const updatedNote = response.body.data;
      expect(updatedNote.id).toBe(originalNote.id);
      expect(updatedNote.title).toBe(updateData.title);
      expect(updatedNote.category).toBe(updateData.category);
      expect(updatedNote.priority).toBe(updateData.priority);
      expect(updatedNote.description).toBe(updateData.description);
      expect(updatedNote.created_at).toBe(originalNote.created_at);
      expect(new Date(updatedNote.updated_at)).toBeInstanceOf(Date);
    });

    test('should return 404 for non-existent note ID', async () => {
      const updateData = validNotes.work;

      const response = await request(app)
        .put('/api/notes/999')
        .send(updateData)
        .expect(404);

      global.testHelper.expectErrorResponse(response, 'Note not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const updateData = validNotes.work;

      const response = await request(app)
        .put('/api/notes/invalid')
        .send(updateData)
        .expect(400);

      global.testHelper.expectErrorResponse(response, 'Invalid note ID');
    });

    test('should validate update data', async () => {
      const originalNote = await dbOperations.createNote(validNotes.work);

      const response = await request(app)
        .put(`/api/notes/${originalNote.id}`)
        .send(invalidNotes.invalidCategory)
        .expect(400);

      global.testHelper.expectErrorResponse(response, 'Validation failed');
      expect(response.body.errors).toContain(validationErrors.categoryInvalid);
    });

    test('should trim whitespace in update data', async () => {
      const originalNote = await dbOperations.createNote(validNotes.work);
      const updateData = createNote({
        title: '  Updated Title  ',
        description: '  Updated Description  '
      });

      const response = await request(app)
        .put(`/api/notes/${originalNote.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Updated Description');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    test('should delete existing note', async () => {
      const createdNote = await dbOperations.createNote(validNotes.ideas);

      const response = await request(app)
        .delete(`/api/notes/${createdNote.id}`)
        .expect(200);

      global.testHelper.expectSuccessResponse(response);
      expect(response.body.message).toBe('Note deleted successfully');
      expect(response.body.data).toEqual(createdNote);

      // Verify note is actually deleted
      const getResponse = await request(app)
        .get(`/api/notes/${createdNote.id}`)
        .expect(404);
    });

    test('should return 404 for non-existent note ID', async () => {
      const response = await request(app)
        .delete('/api/notes/999')
        .expect(404);

      global.testHelper.expectErrorResponse(response, 'Note not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/notes/invalid')
        .expect(400);

      global.testHelper.expectErrorResponse(response, 'Invalid note ID');
    });

    test('should not affect other notes when deleting', async () => {
      const note1 = await dbOperations.createNote(createNote({ title: 'Note 1' }));
      const note2 = await dbOperations.createNote(createNote({ title: 'Note 2' }));
      const note3 = await dbOperations.createNote(createNote({ title: 'Note 3' }));

      // Delete middle note
      await request(app)
        .delete(`/api/notes/${note2.id}`)
        .expect(200);

      // Verify other notes still exist
      await request(app)
        .get(`/api/notes/${note1.id}`)
        .expect(200);

      await request(app)
        .get(`/api/notes/${note3.id}`)
        .expect(200);

      // Verify deleted note is gone
      await request(app)
        .get(`/api/notes/${note2.id}`)
        .expect(404);
    });
  });

  describe('API Error Handling', () => {
    test('should handle non-existent endpoints', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    test('should handle invalid HTTP methods', async () => {
      await request(app)
        .patch('/api/notes')
        .expect(404);
    });

    test('should handle missing Content-Type for JSON endpoints', async () => {
      await request(app)
        .post('/api/notes')
        .send('not json')
        .expect(400);
    });
  });
});