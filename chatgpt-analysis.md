# AI Playground Tech Stack & Architecture Critique

## Frontend

### Tech Stack & Tooling
- React 19.1 with Vite 7 delivers a fast local feedback loop and native ESM builds (`package.json`).
- Material UI 7 aligns the UI around a consistent design system, and React Router 7 keeps routing declarative (`src/App.jsx`).
- The testing toolchain (Vitest + Testing Library + jsdom) mirrors contemporary React starter stacks (`package.json`).
- Risk: React 19 is still gaining ecosystem support; some third-party libraries lag behind, so upgrades may surface compatibility bugs (e.g., around Suspense / useEffect semantics).
- Risk: the stack is JavaScript-only; as the UI grows, missing TypeScript or runtime type guards could let API contract drift go unnoticed.

### Architecture & Design
- `CountProvider` offers a clean source of truth for shared counter/rating state with persistence (`src/context/CountContext.jsx:7-38`).
- Pages consistently wrap content in MUI `Box` components but rely on `position="fixed"` + `width: 100vw` for entire screens (`src/pages/CounterPage.jsx:8-36`, `src/pages/RatingPage.jsx:8-42`, `src/pages/NotesPage.jsx:31-80`). This fights the browser’s flow layout, breaks natural scrolling, and can create double scrollbars—especially once modal dialogs or long forms render.
- `NotesPage` composes list/form views well, yet data fetching is entirely imperative. `NotesList` pulls from the API on mount and after deletes, but there’s no cache invalidation or optimistic UI, leading to extra requests and a jarring refresh cycle (`src/components/NotesList.jsx:23-90`).
- The service layer hard-codes the backend origin (`src/services/notesApi.js:8-99`); deploying to alternate domains/environments mandates code changes rather than env config.
- Styling mixes inline sx props and hard-coded color strings, leaving the theme largely unused. Centralized theming would simplify brand updates and accessibility tuning.

### Testing
- Integration coverage in `src/App.test.jsx` validates routing, context state, and localStorage interactions; this is solid for core flows.
- Component tests exist for most primitives, but several no longer match reality. `src/components/NoteForm.test.jsx` still expects a modal workflow and a `Submit` button that the live component no longer renders, so the suite will fail or mislead future contributors.
- Fetch-based components are not mocked; tests do not verify error handling paths such as network failures thrown by `NotesApiError`.
- No automated visual regression or accessibility checks; since layout depends heavily on absolute positioning, regressions could slip through.

## Backend

### Tech Stack & Tooling
- Express 5 + sqlite3 keep the microservice lightweight; the schema initialization on boot is straightforward (`notes-microservice/server.js`, `notes-microservice/database.js`).
- Jest 30 with Supertest gives fast, hermetic integration coverage (`notes-microservice/tests/api.test.js`).
- Risk: shipping `nodemon` as a production dependency inflates the runtime footprint (`notes-microservice/package.json`).
- Risk: environment concerns (database file path, CORS origin, server port) live as literals; externalizing them via dotenv or process env would help operations.

### Architecture & Design
- `database.js` encapsulates CRUD helpers and graceful shutdown hooks (`notes-microservice/database.js:12-108`), keeping SQL isolated from route handlers.
- Routes centralize validation and error responses, but validation rules are duplicated from the frontend (`routes/notes.js:6-25` vs `src/services/notesApi.js:213-232`). A shared schema (e.g., Zod/Yup) or generated API client would lower divergence risk.
- Express 5 ships `express.json`, so the additional `body-parser` dependency is redundant (`server.js:3,12`).
- The API always returns full note records, even when deleting; for larger payloads or attachments this pattern could become expensive. Consider returning status-only responses where appropriate.
- Carving out a service layer between routes and `dbOperations` would ease cross-cutting concerns (logging, authorization, caching) if the microservice grows.

### Testing
- The Jest suite spins up an isolated app + in-memory database per test via helpers, providing strong integration confidence (`notes-microservice/tests/helpers/testApp.js`).
- Fixtures cover success and failure paths, including validation and database error simulations; this breadth is a major strength for a small service.
- Observed globbed helpers (`global.testHelper`) hide assertion logic that new contributors must discover; exporting explicit utilities may improve readability.
- No contract tests or schema snapshots exist; if the frontend and backend evolve separately, type mismatches could still reach production despite broad coverage.

## Cross-Cutting Observations
- Environment-bound literals (`API_BASE_URL`, sqlite file path, port) should move to configuration so deployments and tests can target alternate hosts without code edits.
- Both layers manually mirror business rules (allowed categories/priorities, validation strings). Consolidating them into a shared package or code-generated client would prevent drift.
- Consider adopting a data-fetching abstraction (TanStack Query, SWR) for the frontend notes workflow; it would give caching, retries, and background refresh out of the box.
- Introducing TypeScript (or at minimum JSDoc typedefs + schema validation) would tighten contracts between the API and UI, particularly around note shapes and error payloads.
- Layout should migrate away from fixed-position viewport wrappers toward responsive flex/grid containers with `Toolbar` offsets, letting the app grow without scroll glitches.
- Monitoring/observability is absent; adding basic logging middleware and frontend error boundaries would make troubleshooting production issues easier.
