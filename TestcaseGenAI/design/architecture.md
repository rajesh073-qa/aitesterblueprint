# Architecture

Overview
- Backend: Node.js + TypeScript (Express) exposing a REST API. Responsibilities: accept Jira requirement text, orchestrate LLM adapters, post-process outputs, persist provenance, export to Jira/CSV.
- Frontend: React + TypeScript (Vite) UI for pasting requirements, choosing LLM provider, reviewing and exporting generated test cases.
- LLM Adapter Layer: Pluggable adapters for each supported model provider. Provide a common interface `generateTests(requirementText, options)`.
- Persistence: SQLite (local) for history, with optional file export.

Data flow
1. User pastes requirement into frontend and clicks Generate.
2. Frontend POSTs to `/api/generate` with requirement text and options.
3. Backend validates input, selects adapter, calls the adapter to generate structured test cases.
4. Backend stores the generation provenance (prompt, provider, model, timestamp) and returns test cases to the frontend.
5. Frontend displays results; user may export to Jira JSON or CSV, or call backend to push to Jira API.

Security
- API keys stored in environment variables. No secrets committed.
- Optionally provide a private LLM (Ollama/LM Studio) endpoint for sensitive data.
