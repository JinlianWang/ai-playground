# Notes Microservice

A Node.js microservice for managing notes with Express and SQLite.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

## API Endpoints

The microservice will expose the following endpoints:

- `POST /api/notes` - Create new note
- `GET /api/notes` - Get all notes  
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Note Schema

```json
{
  "title": "string (required)",
  "category": "work|personal|ideas (required)",
  "priority": "high|medium|low (required)", 
  "description": "string (required)"
}
```