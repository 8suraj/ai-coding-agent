# Claude-style Coding Agent – Frontend

This package contains the React + TypeScript SPA that mimics Claude’s chat experience while streaming Gemini 2.5 responses and showing generated code artifacts. It is built with Vite, TailwindCSS, Redux Toolkit, React Query, Monaco, and a custom markdown renderer.

## Prerequisites

- Node.js 20.x (LTS)
- npm 10.x (bundled with Node 20)
- Backend running locally on `http://localhost:8000` (see `../backend`)

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

`npm run dev` starts Vite on <http://localhost:5173>. The dev server proxies `/api/**` calls to the FastAPI backend via `vite.config.ts`.

## Available Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start Vite with HMR                             |
| `npm run build`   | Type-check + build production assets to `dist/` |
| `npm run preview` | Serve the production bundle locally             |
| `npm run lint`    | Run ESLint (see `eslint.config.js`)             |

## Environment & Configuration

No `.env` file is required for the frontend. API requests are routed to `/api`, which Vite proxies to `http://localhost:8000`. If you change the backend host/port, update `vite.config.ts`.

## Project Structure (high level)

```
src/
 ├─ components/        # Chat UI, sidebar, markdown renderer
 ├─ hooks/             # Streaming hook
 ├─ lib/               # Helpers & shared types
 ├─ store/             # Redux store, slice, selectors, hooks
 ├─ index.css          # Tailwind + custom styles
 └─ main.tsx           # Entry point
```

## Key Features

- Claude-inspired layout with chat on the left and a toggleable sandbox sidebar on the right
- Gemini 2.5 streaming responses rendered Markdown-style with syntax-highlighted code blocks + copy buttons
- Monaco editor for generated artifacts and HTML/React preview sandbox
- Redux Toolkit for chat state, composer editing, resend/edit controls, and artifact toggles
- TailwindCSS for rapid theming and responsive design

## Production Build

```bash
npm run build
# deploy contents of dist/ with your static host of choice
```

Ensure the backend base URL is reachable from your host (configure reverse proxy or change Vite proxy settings accordingly).

## Linting / Formatting

Run `npm run lint` to enforce the shared ESLint config. Tailwind Prettier plugins are not included; feel free to add them if needed.

## Troubleshooting

- **API requests failing**: confirm the FastAPI backend is running on `localhost:8000` or update the proxy target in `vite.config.ts`.
- **Streaming issues**: open DevTools → Network, inspect `/api/chat/stream` for NDJSON chunks.
- **Monaco editor blank**: ensure `window.crypto` is available (some older browsers block it in insecure contexts).

For backend setup and API details, see `../backend/README.md`.
