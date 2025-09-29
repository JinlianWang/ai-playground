# AGENTS.md

Guidance for GPT-based coding agents maintaining the AI Playground full-stack application.

## Project Snapshot
- Multi-page React 19.1 frontend bootstrapped with Vite 7.
- Express 5 + SQLite notes microservice lives in `notes-microservice` and runs on port 3001.
- React Router DOM 7 powers `/counter`, `/rating`, `/notes`, with `/` redirecting to `/counter`.
- Material UI 7 (plus `@mui/icons-material`) provides layout and icons; `Navigation.jsx` is a fixed AppBar rendered on every route.
- Shared `CountProvider` (`src/context/CountContext.jsx`) persists the global count via `localStorage` key `ai-playground-count`.

## Dev Workflow
```bash
npm install                      # install frontend dependencies
npm run dev                      # start Vite dev server (terminal 1, http://localhost:5173)

cd notes-microservice
npm install                      # install backend dependencies
npm start                        # run notes API (terminal 2, http://localhost:3001)

npm run build                    # frontend production build
npm run preview                  # serve built frontend locally
npm run lint                     # eslint gating
npm test                         # vitest in watch mode
npm run test:run                 # vitest single pass (CI)

cd notes-microservice
npm test                         # jest suite for the notes API
npm run test:watch               # jest watch mode
```

## Frontend Architecture & State
- `src/main.jsx` renders `<App />` inside React StrictMode; `App` wraps the router with `CountProvider`.
- `CountProvider` centralizes the counter/rating value, lazily hydrating from `localStorage` and exposing helpers via `useCount()`.
- Counter button and Rating stars are two views of the shared context value; `incrementCount` and `setCountFromRating` drive updates.
- Routing is declared inside `App` using `<Routes>` plus `<Navigate>` for the `/` → `/counter` redirect.
- Pages maintain the fixed-layout pattern: full viewport containers with `paddingTop` to clear the navigation AppBar and `zIndex: 1`.
- `src/services/notesApi.js` hosts the HTTP client, validation helpers, and option metadata used by notes-related components.

## Notes Microservice Overview
- Located in `notes-microservice/` with `server.js` bootstrapping Express, CORS, JSON parsing, and the `/api/notes` routes.
- `database.js` manages SQLite connection, schema creation, CRUD helpers, and graceful shutdown.
- `routes/notes.js` implements validation plus CRUD endpoints (`GET/POST/PUT/DELETE /api/notes`, `GET /api/notes/:id`).
- Jest + Supertest test suites reside under `notes-microservice/tests/`, covering API behavior, database logic, validation, and infrastructure.
- The SQLite database file (`notes.db`) is created automatically; avoid committing schema changes without updating migrations/tests.

## UI Surfaces
- **CounterPage** (`/counter`): centers the increment button using count context.
- **RatingPage** (`/rating`): renders the star rating component backed by the shared count; echoes selected value.
- **NotesPage** (`/notes`): orchestrates list, create, and edit views, switching between `NotesList` and `NoteForm` with back navigation.

## Reusable Components & Services
- `Navigation.jsx`: fixed AppBar with React Router `NavLink` active styling.
- `Rating.jsx`: five-star control managing hover state and emitting rating changes.
- `NotesList.jsx`: fetches notes via the service layer, displays MUI cards, and surfaces edit/delete actions.
- `NoteForm.jsx`: backend-integrated form with loading/error states, validation surfaced from `notesApi`, and create/edit modes.
- Form primitives (`TextInput.jsx`, `Dropdown.jsx`, `TextArea.jsx`) remain reusable building blocks.
- `src/services/notesApi.js`: single entry point for `getAllNotes`, `createNote`, `updateNote`, `deleteNote`, `getNoteById`, validation helpers, and health checks.

## Testing
- Frontend uses Vitest + Testing Library (`src/setupTests.js`) with jsdom and mocked `localStorage`.
- `src/App.test.jsx` validates routing, navigation, shared state, and persistence through the context provider.
- Page/component tests remain co-located (e.g., `CounterPage.test.jsx`, `RatingPage.test.jsx`, `NotesPage.test.jsx`) and should mock backend calls as needed.
- Backend tests run with Jest + Supertest (`notes-microservice/tests/**`); scripts cover unit, integration, validation, and CI modes.

## Implementation Tips
- Use `useCount()` rather than prop drilling when adding counter or rating-related behavior; keep `CountProvider` as the single source of truth.
- Maintain the fixed layout and navigation padding when introducing new pages or refactoring existing ones.
- Route additions require synchronized updates to `Navigation.jsx`, `App.jsx`, and the corresponding tests.
- For notes features, interact with the backend through `notesApi` functions and surface loading/error states in the UI.
- When modifying backend logic, update matching Jest suites, ensure database helpers stay transactional, and regenerate fixtures if schemas change.
- Run both frontend and backend test suites plus `npm run lint` before handing work off; keep commits modular and scoped.
