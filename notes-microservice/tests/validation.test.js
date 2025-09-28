// Comprehensive validation and error handling tests

const request = require('supertest');
const { createTestApp, closeTestApp } = require('./helpers/testApp');
const { createNote, invalidNotes, validationErrors } = require('./fixtures/noteFixtures');

describe('Validation and Error Handling', () => {
  let app, db;

  beforeEach(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    db = testApp.db;
  });

  afterEach(async () => {
    if (db) {
      await closeTestApp(db);
    }
  });

  describe('Field Validation', () => {
    test('should validate all required fields are present', async () => {
      const testCases = [
        { field: 'title', note: { category: 'work', priority: 'high', description: 'test' } },
        { field: 'category', note: { title: 'test', priority: 'high', description: 'test' } },
        { field: 'priority', note: { title: 'test', category: 'work', description: 'test' } },
        { field: 'description', note: { title: 'test', category: 'work', priority: 'high' } }
      ];

      for (const { field, note } of testCases) {
        const response = await request(app)
          .post('/api/notes')
          .send(note)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.length).toBeGreaterThan(0);
      }
    });

    test('should validate field lengths and content', async () => {
      const testCases = [
        {
          name: 'empty title',
          note: createNote({ title: '' }),
          expectedError: validationErrors.titleRequired
        },
        {
          name: 'whitespace title',
          note: createNote({ title: '   ' }),
          expectedError: validationErrors.titleRequired
        },
        {
          name: 'empty description',
          note: createNote({ description: '' }),
          expectedError: validationErrors.descriptionRequired
        },
        {
          name: 'whitespace description',
          note: createNote({ description: '   ' }),
          expectedError: validationErrors.descriptionRequired
        }
      ];

      for (const { name, note, expectedError } of testCases) {
        const response = await request(app)
          .post('/api/notes')
          .send(note)
          .expect(400);

        expect(response.body.errors).toContain(expectedError);
      }
    });

    test('should validate category enum values', async () => {
      const invalidCategories = ['invalid', 'WORK', 'Personal', 'business', '', null, undefined, 123, {}];

      for (const category of invalidCategories) {
        const note = createNote({ category });
        
        const response = await request(app)
          .post('/api/notes')
          .send(note)
          .expect(400);

        expect(response.body.errors).toContain(validationErrors.categoryInvalid);
      }
    });

    test('should validate priority enum values', async () => {
      const invalidPriorities = ['invalid', 'HIGH', 'Medium', 'urgent', '', null, undefined, 1, {}];

      for (const priority of invalidPriorities) {
        const note = createNote({ priority });
        
        const response = await request(app)
          .post('/api/notes')
          .send(note)
          .expect(400);

        expect(response.body.errors).toContain(validationErrors.priorityInvalid);
      }
    });

    test('should handle multiple validation errors', async () => {
      const invalidNote = {
        title: '',
        category: 'invalid',
        priority: 'invalid',
        description: ''
      };

      const response = await request(app)
        .post('/api/notes')
        .send(invalidNote)
        .expect(400);

      expect(response.body.errors).toHaveLength(4);
      expect(response.body.errors).toContain(validationErrors.titleRequired);
      expect(response.body.errors).toContain(validationErrors.categoryInvalid);
      expect(response.body.errors).toContain(validationErrors.priorityInvalid);
      expect(response.body.errors).toContain(validationErrors.descriptionRequired);
    });
  });

  describe('Content-Type and Format Validation', () => {
    test('should handle non-JSON content types gracefully', async () => {
      // With text/plain content-type, body-parser doesn't parse it, 
      // so validation will fail due to missing fields
      const response = await request(app)
        .post('/api/notes')
        .set('Content-Type', 'text/plain')
        .send('not json')
        .expect(400);
        
      // Should still return validation error (not 500)
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    test('should reject malformed JSON', async () => {
      await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send('{ title: "missing quotes" }')
        .expect(400);
    });

    test('should reject empty request body', async () => {
      await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send()
        .expect(400);
    });

    test('should handle null request body', async () => {
      await request(app)
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send(null)
        .expect(400);
    });
  });

  describe('HTTP Status Code Validation', () => {
    test('should return correct status codes for different scenarios', async () => {
      // 200 for successful GET
      await request(app)
        .get('/api/notes')
        .expect(200);

      // 201 for successful POST
      await request(app)
        .post('/api/notes')
        .send(createNote())
        .expect(201);

      // Create a note to test other scenarios
      const createdNote = await request(app)
        .post('/api/notes')
        .send(createNote())
        .expect(201);

      const noteId = createdNote.body.data.id;

      // 200 for successful GET by ID
      await request(app)
        .get(`/api/notes/${noteId}`)
        .expect(200);

      // 200 for successful PUT
      await request(app)
        .put(`/api/notes/${noteId}`)
        .send(createNote({ title: 'Updated' }))
        .expect(200);

      // 200 for successful DELETE
      await request(app)
        .delete(`/api/notes/${noteId}`)
        .expect(200);

      // 404 for GET non-existent note
      await request(app)
        .get(`/api/notes/${noteId}`)
        .expect(404);

      // 404 for PUT non-existent note
      await request(app)
        .put(`/api/notes/${noteId}`)
        .send(createNote())
        .expect(404);

      // 404 for DELETE non-existent note
      await request(app)
        .delete(`/api/notes/${noteId}`)
        .expect(404);

      // 400 for invalid data
      await request(app)
        .post('/api/notes')
        .send(invalidNotes.invalidCategory)
        .expect(400);

      // 400 for invalid ID format
      await request(app)
        .get('/api/notes/invalid')
        .expect(400);
    });
  });

  describe('Error Response Format', () => {
    test('should return consistent error response format', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send(invalidNotes.invalidCategory)
        .expect(400);

      // Check error response structure
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    test('should return specific error messages', async () => {
      const response = await request(app)
        .get('/api/notes/999')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Note not found'
      });
    });

    test('should include validation details in 400 errors', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send(invalidNotes.emptyTitle)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContain(validationErrors.titleRequired);
    });
  });

  describe('Edge Cases and Security', () => {
    test('should handle extremely long field values', async () => {
      const veryLongNote = createNote({
        title: 'A'.repeat(10000),
        description: 'B'.repeat(50000)
      });

      // Should succeed - database can handle long strings
      await request(app)
        .post('/api/notes')
        .send(veryLongNote)
        .expect(201);
    });

    test('should handle special characters and unicode', async () => {
      const unicodeNote = createNote({
        title: '特殊字符 🚀 💻',
        description: 'Unicode test: ñáéíóú àèìòù äëïöü çñ'
      });

      const response = await request(app)
        .post('/api/notes')
        .send(unicodeNote)
        .expect(201);

      expect(response.body.data.title).toBe(unicodeNote.title);
      expect(response.body.data.description).toBe(unicodeNote.description);
    });

    test('should handle SQL injection attempts safely', async () => {
      const maliciousNote = createNote({
        title: "'; DROP TABLE notes; --",
        description: "test'; INSERT INTO notes VALUES (999, 'hacked'); --"
      });

      const response = await request(app)
        .post('/api/notes')
        .send(maliciousNote)
        .expect(201);

      // Should create the note with literal content, not execute SQL
      expect(response.body.data.title).toBe(maliciousNote.title);
      
      // Verify no SQL injection occurred
      const allNotes = await request(app)
        .get('/api/notes')
        .expect(200);
      
      expect(allNotes.body.count).toBe(1);
      expect(allNotes.body.data[0].title).not.toBe('hacked');
    });

    test('should handle XSS attempts in content', async () => {
      const xssNote = createNote({
        title: '<script>alert("xss")</script>',
        description: '<img src="x" onerror="alert(1)">'
      });

      const response = await request(app)
        .post('/api/notes')
        .send(xssNote)
        .expect(201);

      // Should store content as-is (API doesn't sanitize, that's frontend's job)
      expect(response.body.data.title).toBe(xssNote.title);
      expect(response.body.data.description).toBe(xssNote.description);
    });

    test('should handle concurrent validation requests', async () => {
      const promises = [];
      
      // Send multiple invalid requests concurrently
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/notes')
            .send(invalidNotes.invalidCategory)
            .expect(400)
        );
      }

      const responses = await Promise.all(promises);
      
      // All should fail validation consistently
      responses.forEach(response => {
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toContain(validationErrors.categoryInvalid);
      });
    });
  });

  describe('Update Validation', () => {
    test('should validate update data same as create data', async () => {
      // First create a valid note
      const createdNote = await request(app)
        .post('/api/notes')
        .send(createNote())
        .expect(201);

      const noteId = createdNote.body.data.id;

      // Try to update with invalid data
      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .send(invalidNotes.invalidPriority)
        .expect(400);

      expect(response.body.errors).toContain(validationErrors.priorityInvalid);
    });

    test('should validate all fields in update requests', async () => {
      const createdNote = await request(app)
        .post('/api/notes')
        .send(createNote())
        .expect(201);

      const noteId = createdNote.body.data.id;

      // Missing fields should trigger validation
      const incompleteUpdate = { title: 'Only title' };
      
      await request(app)
        .put(`/api/notes/${noteId}`)
        .send(incompleteUpdate)
        .expect(400);
    });
  });
});