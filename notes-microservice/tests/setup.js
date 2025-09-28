// Test setup file - runs before each test file

// Increase timeout for database operations
jest.setTimeout(30000);

// Environment configuration for tests
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise during tests (optional)
// Uncomment if you want cleaner test output
// global.console = {
//   ...console,
//   log: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Global test helpers
global.testHelper = {
  // Test data factory for notes
  createValidNote: (overrides = {}) => ({
    title: 'Test Note',
    category: 'work',
    priority: 'high',
    description: 'This is a test note',
    ...overrides
  }),
  
  // Common test patterns
  expectValidNoteStructure: (note) => {
    expect(note).toHaveProperty('id');
    expect(note).toHaveProperty('title');
    expect(note).toHaveProperty('category');
    expect(note).toHaveProperty('priority');
    expect(note).toHaveProperty('description');
    expect(note).toHaveProperty('created_at');
    expect(note).toHaveProperty('updated_at');
  },
  
  // API response structure validation
  expectSuccessResponse: (response, expectedData = null) => {
    expect(response.body).toHaveProperty('success', true);
    if (expectedData) {
      expect(response.body).toHaveProperty('data');
    }
  },
  
  expectErrorResponse: (response, expectedMessage = null) => {
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    if (expectedMessage) {
      expect(response.body.message).toBe(expectedMessage);
    }
  }
};

// Global test cleanup
afterAll(async () => {
  // Any global cleanup can be added here
});