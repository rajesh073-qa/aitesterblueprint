# LLM Adapter Spec

Adapters implement a simple interface:

interface LLMAdapter {
  generateTests(requirementText: string, options?: any): Promise<GeneratedTestCase[]>;
}

Adapters should handle:
- Authentication (via env variables)
- Rate limiting / retries
- Prompt templating
- Returning structured JSON conforming to GeneratedTestCase

Included: `MockAdapter` for local development. Implement real adapters in `backend/src/adapters/`.
