# CodeTutor AI (Frontend + Backend)

This repo contains a Vite + React (TypeScript) frontend and a Node/Express (TypeScript) backend for the CodeTutor AI project.

## Quick Start

Requires Node.js 20.x (use `.nvmrc`).

### Backend

1) Configure environment variables (see also `FREE_SERVICES_SETUP.md`). Create `server/.env` (do NOT commit real keys):

```
MONGO_URI=mongodb://localhost:27017/codetutor
# or use MONGODB_URI; the server supports both
MONGODB_URI=

# Optional: allow server to start without MongoDB in dev
ALLOW_START_WITHOUT_DB=true

# Optional AI providers
OLLAMA_URL=http://localhost:11434
HUGGINGFACE_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=

# OpenRouter (OpenAI-compatible)
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
# Optional but recommended for attribution
# OPENROUTER_SITE_URL=http://localhost:8080
# OPENROUTER_APP_NAME=CodeTutor AI (Local)
OPENROUTER_MODEL=openai/gpt-4o-mini

# Mistral
MISTRAL_API_KEY=
MISTRAL_BASE_URL=https://api.mistral.ai/v1
MISTRAL_MODEL=mistral-small-latest

PISTON_API_URL=https://emkc.org/api/v2/piston
```

2) Run the backend:

```bash
cd server
npm install
npm run dev
# Server listens on http://localhost:4000
```

Health check:

```bash
curl http://localhost:4000/health
```

### Frontend

From the repo root:

```bash
VITE_BACKEND_URL=http://localhost:4000 VITE_PORT=8080 npm install
npm run dev
# App served at http://localhost:8080 (proxy to backend at :4000)
```

If your Node.js is very new (e.g., v22+), update dev deps:

```bash
npm i -D vite @vitejs/plugin-react-swc esbuild
```

## Notes

- Vite dev server proxies `/api` to `VITE_BACKEND_URL` (default `http://localhost:4000`).
- The backend prefers `MONGO_URI`, falls back to `MONGODB_URI`, then local default.
- For local-only dev without MongoDB, set `ALLOW_START_WITHOUT_DB=true` to start in a limited mode for UI/health checks.

### Provider selection
- The backend auto-detects configured AI providers via environment variables and prefers: OpenAI → OpenRouter → Gemini → Ollama → HuggingFace.
- To use OpenRouter without OpenAI, set `OPENROUTER_API_KEY` (and leave `OPENAI_API_KEY` unset).
- To use Mistral, set `MISTRAL_API_KEY`.

## Changelog

See `CHANGELOG.md` for recent updates.

