# Claude-style Coding Agent – Backend

FastAPI application that brokers requests between the frontend and Google’s Gemini 2.5 API.  
It streams tokens back to the client via NDJSON, keeps a short-term in-memory conversation history per session, and extracts code artifacts from responses.

## Prerequisites

- Python 3.10+
- Google Gemini API key (free tier works)
- Optional: `uvicorn` for local development (installed via `requirements.txt`)

## Initial Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Environment Variables

Copy `.env.example` → `.env` and fill in the values:

```
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.0-flash-exp      # optional override
ALLOWED_ORIGINS=http://localhost:5173  # comma-separated or JSON array
MAX_HISTORY_MESSAGES=10                # number of past turns kept per session
```

The `allowed_origins` value can be:

- JSON array: `["http://localhost:5173","https://example.com"]`
- Comma-separated string: `http://localhost:5173,https://example.com`

## Running the Server

```bash
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The API is then available at <http://localhost:8000>. Swagger docs live at `/docs`.

## API Overview

| Method | Endpoint           | Description                                                                 |
| ------ | ------------------ | --------------------------------------------------------------------------- |
| POST   | `/api/chat/stream` | Accepts `session_id` + messages, forwards to Gemini, streams NDJSON chunks. |
| GET    | `/health`          | Simple readiness check returning `{ "status": "ok" }`.                      |

`/api/chat/stream` response format:

```json
{"type":"token","content":"partial text"}
{"type":"token","content":"..."}
{"type":"complete","content":"full text","artifact":{"language":"html","code":"..."}}
```

The frontend consumes and assembles these chunks, rendering tokens as they arrive and opening the code sidebar when an `artifact` is provided.

## Key Files

```
app/
 ├─ api/chat.py          # Streaming endpoint, artifact extraction
 ├─ core/
 │   ├─ config.py        # Settings (env-backed) + allowed-origin parsing
 │   ├─ gemini_client.py # Gemini streaming wrapper
 │   └─ memory.py        # Simple in-memory conversation store
 ├─ models/schemas.py    # Pydantic request/response models
 └─ main.py              # FastAPI initialization & CORS config
requirements.txt         # FastAPI, google-generativeai, etc.
```

## Notes & Troubleshooting

- **429 / quota errors**: The backend surfaces Gemini quota issues as `type:"error"` chunks with a descriptive message. Watch server logs for exact exceptions.
- **Memory store**: Conversations are kept in-process; restarting the server wipes history. Swap `memory.py` with Redis or a DB if you need persistence.
- **CORS**: Update `ALLOWED_ORIGINS` if serving the frontend outside `localhost:5173`.
- **Production**: Run behind a process manager (e.g., `uvicorn --host 0.0.0.0 --port 8000`) and secure your `.env`.

For the React client setup and UI details, see `../frontend/README.md`.
