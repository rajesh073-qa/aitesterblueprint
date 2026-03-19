# Findings

## Research
- **Core Purpose**: Generating functional and non-functional test cases for APIs and Web Applications.
- **Input Mechanism**: Jira requirements provided by users via copy-paste or chat inputs.
- **Output Constraint**: Generated test cases must strictly be in Jira format.
- **Local LLM Infrastructure**: Support for multiple AI providers including Ollama, LM Studio, Groq, OpenAI, Claude, and Gemini.

## Discoveries & Design Configuration
- **Design Layout**: A two-view application identified from `AiBluePrint/Design/Design.png`.
   1. **Main Chat Interface**: Includes a "History" sidebar, a main display area for generated test cases, and a chat input box at the bottom ("Ask here is here TC for Requiremnt").
   2. **Settings Interface**: Includes configuration menus for LLM providers (e.g., Ollama Setting, Groq Setting, Open AI API keys) along with "Save Button" and "Test Connection" actions.
- **Generator Tech Stack**: Node.js backend with TypeScript, React frontend with TypeScript.

## Constraints
- Execution Halted until the Blueprint is fully approved.
- All code and test generation outputs must adhere exactly to the defined Jira format.
