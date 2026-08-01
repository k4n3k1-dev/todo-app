# Third-Party Code

## Runtime Dependencies

- **next** — the framework used for both the frontend (App Router pages) and backend (API routes) in a single project, as required by the brief.
- **react** / **react-dom** — required by Next.js to render the UI.
- **better-sqlite3** — a synchronous SQLite driver, chosen on the recommendation of a student who took this course previously, who suggested it would be easier to work with. This suited the project well since a local single-user app has no network latency to manage, meaning synchronous calls keep the code simple without needing async/await scattered through the database logic.
- **tailwindcss** / **@tailwindcss/postcss** — utility-first CSS framework, used to style the app without writing custom CSS by hand.

## Development Dependencies

- **eslint** / **eslint-config-next** — linting, installed by default via `create-next-app` to catch code issues early.
- **vitest** — the test runner. Chosen for a simpler, more readable testing setup rather than relying on Node's built-in test module, and to gain experience with a dedicated testing framework.
- **@vitejs/plugin-react** — allows Vitest to parse JSX, included for compatibility even though the current test suite tests plain JavaScript logic rather than React components directly.