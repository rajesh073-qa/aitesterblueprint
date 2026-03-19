# Task Plan

## Phases
- [x] Phase 0: Initialization
- [ ] Phase 1: Discovery & Blueprint
- [ ] Phase 2: Execution

## Goals
- **MVP Completion**: A full-stack application capable of transforming Jira requirements into structured test cases via various AI models.
- **Frontend**: React (TypeScript) Application with Main Chat and Settings views.
- **Backend**: Node.js (TypeScript) Application handling LLM provider routing and test case generation logic.
- **Format Integrity**: Strict enforcement of Jira format for outputted test cases.

## Blueprint (Draft)
### 1. Architecture
- **Frontend (React + TS)**: Manages state for History, Chat Input, Output Display, and Model Settings.
- **Backend (Node.js + TS)**: Exposes APIs for Chat/Test Generation and Settings Management. Acts as a proxy/adapter to the specific LLM Providers.
- **LLM Integrations**: Adapters for Ollama, LM Studio, Groq, OpenAI, Claude, and Gemini.

### 2. Core Features (MVP)
- **Settings Page**: Ability to input API keys/endpoint URLs for different providers and "Test Connection".
- **Chat Interface**: To accept Jira requirements, query the selected LLM, and display the generated Jira-formatted test cases.
- **History Tracking**: Keep track of previous generations.

## Checklists
- [x] Answer Discovery Questions
- [x] Draft Blueprint
- [ ] User Approves Blueprint
