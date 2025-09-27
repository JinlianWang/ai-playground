# AGENTS.md

Guidance for GPT-based coding agents maintaining the Policy Portal React application.

## Project Snapshot
- Multi-page React 19.1 app bootstrapped with Vite 7.
- React Router DOM 7 drives `/counter`, `/rating`, `/notes` plus `/` redirect.
- Material UI 7 provides layout primitives; fixed `Navigation` AppBar sits above every page.
- Global `count` state in `src/App.jsx` persists via `localStorage` key `policy-portal-count`.

## Dev Workflow
```bash
npm install         # install dependencies
npm run dev         # start Vite dev server
npm run build       # production build
npm run preview     # preview built assets
npm run lint        # eslint gating
npm test            # vitest in watch mode
npm run test:run    # vitest single pass (CI)
```

## Architecture & State
- `src/main.jsx` renders `<App />` inside React StrictMode.
- `App` owns the single `count` state, lazily initializing from `localStorage` and writing back on every change (`src/App.jsx`).
- Counter button and Rating stars are two views of the same value; `handleCountChange` increments, `handleRatingChange` sets an explicit rating.
- Routing is declared inside `App` using `<Routes>` with `<Navigate>` redirect from `/` → `/counter`.
- Layout relies on a fixed `AppBar` (`Navigation.jsx`) and fixed, full-viewport page containers that pad for the nav height and use `zIndex: 1`.

## UI Surfaces
- **CounterPage** (`/counter`): centered button showing `count` and invoking `onCountChange`.
- **RatingPage** (`/rating`): Material UI typography + custom `Rating` component with hover highlighting and value echo.
- **NotesPage** (`/notes`): scrollable full-screen page composed of `NoteForm`.

## Reusable Components
- `Navigation.jsx`: fixed top bar with `NavLink` styling for active states.
- `Rating.jsx`: manages internal hover state while syncing selected rating back through `onRatingChange`.
- `NoteForm.jsx`: controlled form with reusable inputs (`TextInput`, `Dropdown`, `TextArea`) and a confirmation `SubmitModal`.
- `SubmitModal.jsx`: displays submitted form data and confirms via callback before resetting the form.

## Testing
- Vitest + Testing Library configured in `src/setupTests.js` with jsdom and a mocked `localStorage`.
- `src/App.test.jsx` covers routing, navigation, state synchronization, and persistence expectations.
- Component and page tests live alongside their implementations to encourage co-located additions when features evolve.

## Implementation Tips
- Preserve the single source of truth for `count`; new features that touch rating or counter flows should reuse the existing handlers or derive from the shared state.
- Maintain the fixed-layout pattern (full viewport, `paddingTop` for nav clearance) if adding routes or expanding pages.
- Update navigation links, routes, and tests together when introducing new pages or flows.
- Favor semantic queries in tests and extend the localStorage mock as needed for persistence features.
- Use repo tooling (`npm run lint`, `npm test`) before handing work off; keep changes modular for clean commits.
