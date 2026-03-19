# Task Plan

## Blueprint 

### Architecture
- **Backend:** Node.js with TypeScript (Express or similar framework handling API routes).
- **Frontend:** ReactJS (Single Page Application).

### Core Features
1. **Chat UI:** 
   - A history sidebar to show past interactions.
   - A main chat area where the AI provides the generated test cases.
   - An input area where users can drop Jira card requirements or type prompt requirements natively.
2. **Settings UI:**
   - Dedicated configuration inputs for various AI Providers: Ollama API, LLM Studio API, Groq API, OpenAI API, Claude API, and Gemini API.
   - A "Test Connection" button to verify API configurations.
   - A "Save Button" to persist settings.
3. **Test Generation Output:**
   - Standardized output format strict to **Jira Card Format**.
   - Output includes Functional, Non-functional, UI, and API test cases based on the user requirement.
   
## Phases
- [x] Phase 1: Discovery 
- [x] Phase 2: Blueprint Approval
- [x] Phase 3: Setup & Initialization (Frontend & Backend)
- [x] Phase 4: Implementation (Backend APIs & Provider integrations)
- [x] Phase 5: Implementation (Frontend UI Application Logic)
- [ ] Phase 6: Testing & Iteration (Current)

## Goals
- Establish a React frontend reflecting the layout defined in `Design.png`.
- Establish a Node.js (TypeScript) backend that connects dynamically to the chosen AI provider.
- Ensure test cases are reliably formatted as Jira cards.

## Checklists
### Initialization
- [x] Create `task_plan.md`
- [x] Create `findings.md`
- [x] Create `progress.md`
- [x] Create `context.md`

### Discovery
- [x] Ask discovery questions
- [x] Receive project requirements
- [x] Draft initial blueprint

### Blueprint Approval
- [x] Get blueprint approved by User
