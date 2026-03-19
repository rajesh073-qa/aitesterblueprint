export type LLMProvider = 'Ollama' | 'LM Studio' | 'Groq' | 'OpenAI' | 'Claude' | 'Gemini';

export interface ProviderSettings {
  apiKey?: string;
  baseURL?: string; // For Ollama / LM Studio
  model?: string;
}

export type AppSettings = Record<LLMProvider, ProviderSettings>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO String to persist correctly in JSON
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  provider: LLMProvider;
  model: string;
}
