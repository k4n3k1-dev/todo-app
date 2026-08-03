# Running It

## Requirements

- Node.js v20.20.2 or later (developed and tested on this version)
- npm (comes bundled with Node.js)

## Install

From a clean clone of this repository:

\```bash
npm install
\```

## Run

\```bash
npm run dev
\```

The application will be available at `http://localhost:3000`. A SQLite database file (`todo.db`) will be created automatically in the project root on first run.

## Test

\```bash
npm test
\```

This runs the full test suite once (via `vitest run`) against a separate throwaway database, and exits with a pass/fail result. It does not affect the real `todo.db` used by the running application.

---

*AI Declaration: The preceding document was reviewed and edited with: Claude-Web[Claude Sonnet 5]*