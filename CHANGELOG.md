# Changelog

All notable changes to this project will be documented in this file.

## 2025-11-03

- Align MongoDB env var names: backend now supports `MONGO_URI` (preferred) and `MONGODB_URI`.
- Fix provider status bug in `server/src/services/multi-ai.service.ts` (replaced `this.aiProvider` with `this.primaryProvider`).
- Support both `OLLAMA_URL` and `OLLAMA_BASE_URL` for local LLM configuration.
- Clarified free services setup and environment variables in `FREE_SERVICES_SETUP.md`.
- Minor inline comments added to clarify provider detection and configuration.
- Pin Node.js to 20.x via `.nvmrc` and update README to avoid Node 22 ESM/CJS issues with dev tooling.

### Added
- OpenRouter support via `OPENROUTER_API_KEY` and `OPENROUTER_BASE_URL`; new service `server/src/services/openrouter-ai.service.ts`.
- Mistral support via `MISTRAL_API_KEY` and `MISTRAL_BASE_URL`; new service `server/src/services/mistral-ai.service.ts`.
- Provider auto-detection in `server/src/services/multi-ai.service.ts` now includes OpenRouter and Mistral.

### Security / Ops
- Backend hardened with `helmet`, `compression`, and `express-rate-limit`.
- CORS origin configurable via `CORS_ORIGIN` (comma-separated).
- MongoDB connection string logging is now redacted.
- JWT secret must be set in non-development mode.

### Frontend / DX
- Vite dev server now reads `VITE_BACKEND_URL` and `VITE_PORT` from env.

