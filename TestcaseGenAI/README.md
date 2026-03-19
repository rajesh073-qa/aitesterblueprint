# TestcaseGenAI — Jira Test Case Generator

This repository contains a TypeScript Node backend and a React + TypeScript frontend that convert Jira requirement text into structured functional and non-functional test cases (Jira JSON / CSV export).

Overview
- Backend: Express + TypeScript providing an API to generate test cases. Pluggable LLM adapter interface (mock implementation included).
- Frontend: Vite + React + TypeScript UI to paste Jira requirements, select model/provider, review generated test cases, and export to Jira JSON/CSV.
- Design: `design/` contains architecture notes, prompt templates, and Jira mapping.

Quick start (developer)

1. Install dependencies for backend and frontend (from repository root):

```powershell
cd d:\Automation-git\TestcaseGenAI\backend; npm install
cd ..\frontend; npm install
```

2. Run backend and frontend in separate terminals:

```powershell
# Terminal 1 - Backend
cd d:\Automation-git\TestcaseGenAI\backend
npm run dev

# Terminal 2 - Frontend
cd d:\Automation-git\TestcaseGenAI\frontend
npm run dev
```

3. Open the frontend at http://localhost:5173 and paste a Jira requirement to generate tests.

Notes
- The included LLM adapter is a mock. Replace or configure adapters in `backend/src/adapters/` to use real LLM providers (Ollama, LM Studio, Grok, OpenAI, Claude, Gemini).
- Do not commit secrets. Use environment variables for API keys.

Files added
- `backend/` — Node + TypeScript API
- `frontend/` — Vite + React UI
- `design/` — design documents and templates

Next steps
- Configure a real LLM adapter and provide API keys in `.env` for end-to-end generation.
- Add automated unit and integration tests in the CI pipeline.
