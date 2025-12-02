# Claude-style AI Coding Agent (Monorepo)

Full-stack Gemini 2.5 coding agent inspired by Anthropic’s Claude.  
The repository hosts both the FastAPI backend and the React/Vite frontend in a single mono repo.

## Repository Structure

```
.
├─ backend/   # FastAPI service: Gemini proxy, streaming, memory
├─ frontend/  # React + Vite client: Claude-style UI, Monaco sandbox
└─ README.md  # (this file)
```

- See `backend/README.md` for server setup, environment variables, and API details.
- See `frontend/README.md` for the UI stack, scripts, and development workflow.

## Quick Start

1. **Backend**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env   # add your GEMINI_API_KEY
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open <http://localhost:5173> and chat with the agent while the backend streams responses via `/api/chat/stream`.

## Key Features

- Claude-style chat UX with independent chat + code preview scroll areas
- Gemini 2.5 streaming, short-term memory, and code artifact extraction
- Monaco editor with download + sandbox preview (HTML/React)
- Redux Toolkit for resend/edit of prompts, composer state, and sidebar toggles

Contributions welcome—please update the respective package README if changing backend/frontend behavior.\*\*\*
