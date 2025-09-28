# Notes Microservice

A Node.js microservice for managing notes with Express.js and SQLite database.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ SQLite database with persistent storage
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend integration
- ✅ Automatic database initialization
- ✅ Graceful shutdown handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Setup

```bash
# Navigate to the microservice directory
cd notes-microservice

# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# OR start production server
npm start
```

The microservice will start on **port 3001** and automatically:
- Create the SQLite database file (`notes.db`) if it doesn't exist
- Initialize the database schema
- Be ready to accept API requests

### Health Check

Visit `http://localhost:3001/health` to verify the service is running.

## Testing

The microservice includes a comprehensive test suite with **107 tests** covering all functionality.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose

# Run specific test categories
npm run test:unit         # Database unit tests only
npm run test:integration  # API integration tests only
npm run test:validation   # Validation tests only

# Run tests for CI/CD (no watch mode)
npm run test:ci
```

### Test Structure

The test suite is organized into several categories:

#### 1. **Basic Setup Tests** (`tests/basic.test.js`)
- Jest configuration verification
- Test helpers and utilities

#### 2. **Database Infrastructure Tests** (`tests/infrastructure.test.js`) 
- Database setup and teardown
- Basic CRUD operations
- Test helper functionality

#### 3. **Database Unit Tests** (`tests/database.test.js`)
- All database operations (`getAllNotes`, `getNoteById`, `createNote`, `updateNote`, `deleteNote`)
- Edge cases and data validation
- Performance testing with large datasets

#### 4. **Database Error Handling** (`tests/database.errors.test.js`)
- SQL constraint violations
- Connection error handling  
- SQL injection protection
- Concurrent operations
- Memory and performance testing

#### 5. **API Integration Tests** (`tests/api.test.js`)
- All HTTP endpoints testing
- Request/response validation
- HTTP status codes
- Error response formatting

#### 6. **Validation Tests** (`tests/validation.test.js`)
- Input validation for all fields
- Content-Type handling
- Security testing (XSS, SQL injection)
- Unicode and special character support

### Test Coverage

The test suite provides comprehensive coverage of:
- ✅ All API endpoints (GET, POST, PUT, DELETE)
- ✅ All database operations
- ✅ Input validation and error handling
- ✅ Security and edge cases
- ✅ Concurrent operations
- ✅ Performance scenarios

Run `npm run test:coverage` to see detailed coverage reports.

### Testing Architecture

- **Jest** - Testing framework with parallel execution
- **Supertest** - HTTP endpoint testing
- **In-Memory SQLite** - Fast, isolated database testing  
- **Test Fixtures** - Reusable test data and scenarios
- **Test Helpers** - Common utilities and assertions

## API Documentation

Base URL: `http://localhost:3001`

### Endpoints

#### Get All Notes
```http
GET /api/notes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sample Note",
      "category": "work",
      "priority": "high", 
      "description": "This is a sample note",
      "created_at": "2025-09-28T12:00:00.000Z",
      "updated_at": "2025-09-28T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Specific Note
```http
GET /api/notes/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Sample Note",
    "category": "work",
    "priority": "high",
    "description": "This is a sample note",
    "created_at": "2025-09-28T12:00:00.000Z", 
    "updated_at": "2025-09-28T12:00:00.000Z"
  }
}
```

#### Create New Note
```http
POST /api/notes
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My New Note",
  "category": "work",
  "priority": "high",
  "description": "Description of the note"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 2,
    "title": "My New Note",
    "category": "work", 
    "priority": "high",
    "description": "Description of the note",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T12:00:00.000Z"
  }
}
```

#### Update Note
```http
PUT /api/notes/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "category": "personal",
  "priority": "medium", 
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": 2,
    "title": "Updated Note Title",
    "category": "personal",
    "priority": "medium",
    "description": "Updated description", 
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T12:05:00.000Z"
  }
}
```

#### Delete Note
```http
DELETE /api/notes/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 2,
    "title": "Deleted Note",
    "category": "work",
    "priority": "high",
    "description": "This note was deleted",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T12:00:00.000Z"
  }
}
```

### Field Validation

All note operations require these fields:

| Field | Type | Required | Valid Values |
|-------|------|----------|-------------|
| `title` | string | ✅ | Non-empty string |
| `category` | string | ✅ | `work`, `personal`, `ideas` |
| `priority` | string | ✅ | `high`, `medium`, `low` |
| `description` | string | ✅ | Non-empty string |

### Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required",
    "Category must be one of: work, personal, ideas"
  ]
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "message": "Note not found"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## Testing Examples

### Using curl

```bash
# Create a note
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "category": "work", 
    "priority": "high",
    "description": "This is my first note via API"
  }'

# Get all notes
curl http://localhost:3001/api/notes

# Get specific note
curl http://localhost:3001/api/notes/1

# Update a note
curl -X PUT http://localhost:3001/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Note",
    "category": "personal",
    "priority": "medium", 
    "description": "This note has been updated"
  }'

# Delete a note
curl -X DELETE http://localhost:3001/api/notes/1
```

## Integration with Frontend

This microservice is fully integrated with the React frontend, providing a complete notes management system. The API endpoints support the same field structure as the `NoteForm` component:

- `title` → Note title input
- `category` → Category dropdown (work/personal/ideas)  
- `priority` → Priority dropdown (high/medium/low)
- `description` → Description textarea

### Frontend Integration Features

- **NotesList Component**: Displays all notes with edit/delete functionality
- **NoteForm Component**: Integrated for create and edit operations with real-time validation
- **NotesPage**: Three-view architecture (list, create, edit) with seamless navigation
- **API Service Layer**: Comprehensive HTTP client (`src/services/notesApi.js`) with error handling
- **Loading States**: Full loading indicators and error handling throughout the UI
- **Real-time Updates**: Notes list refreshes automatically after create/edit/delete operations

The frontend automatically connects to `http://localhost:3001/api/notes` and provides a complete CRUD interface.

## Database

- **Engine:** SQLite
- **File:** `notes.db` (created automatically)
- **Schema:** Notes table with proper constraints and timestamps
- **Backup:** The `notes.db` file contains all your data and can be backed up/restored

## Development

- **Hot Reload:** Use `npm run dev` with nodemon for automatic restarts during development
- **Logs:** All database operations and errors are logged to console
- **Graceful Shutdown:** Press Ctrl+C to properly close database connections