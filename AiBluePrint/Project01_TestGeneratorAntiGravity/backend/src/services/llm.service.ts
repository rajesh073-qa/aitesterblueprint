import axios from 'axios';

export type ProviderType = 'ollama' | 'groq' | 'openai' | 'claude' | 'gemini' | 'llmstudio';

export interface LLMConfig {
    provider: ProviderType;
    apiUrl?: string;    // Custom URL for Ollama or LLM Studio
    apiKey?: string;    // Auth key for Groq/OpenAI/Claude/Gemini
    model?: string;     // Model to use
}

const SYSTEM_PROMPT = `You are AntiGravity, an expert QA Automation Engineer.
Your task is to generate comprehensive test cases based on the provided requirement or Jira card.
You MUST include Functional, Non-functional, UI, and API test cases.
You MUST strictly format the ENTIRE output using Jira Wiki Markup language (e.g., h2. for headings, *bold* for emphasis, bullet points using *, tables using ||).
Provide NO introductory or concluding text, ONLY the Jira-formatted test cases.`;

export const generateTestCases = async (prompt: string, config: LLMConfig): Promise<string> => {
    switch (config.provider) {
        case 'openai':
        case 'groq':
        case 'llmstudio':
            return handleOpenAICompatible(prompt, config);
        case 'ollama':
            return handleOllama(prompt, config);
        case 'claude':
            return handleClaude(prompt, config);
        case 'gemini':
            return handleGemini(prompt, config);
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
};

export const testConnection = async (config: LLMConfig): Promise<boolean> => {
    const testPrompt = "Ping. Reply 'Pong' only.";
    const res = await generateTestCases(testPrompt, { ...config, model: config.model || getDefaultModel(config.provider) });
    return !!res;
};

const getDefaultModel = (provider: ProviderType): string => {
    switch(provider) {
        case 'openai': return 'gpt-4o';
        case 'groq': return 'llama-3.1-70b-versatile';
        case 'claude': return 'claude-3-5-sonnet-20240620';
        case 'llmstudio': return 'local-model';
        case 'ollama': return 'llama3';
        case 'gemini': return 'gemini-1.5-pro';
        default: return '';
    }
};

const handleOpenAICompatible = async (prompt: string, config: LLMConfig): Promise<string> => {
    let baseUrl = 'https://api.openai.com/v1/chat/completions';
    if (config.provider === 'groq') baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    if (config.provider === 'llmstudio') baseUrl = config.apiUrl || 'http://localhost:1234/v1/chat/completions';

    const headers = {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
    };

    const data = {
        model: config.model || getDefaultModel(config.provider),
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
        ]
    };

    const response = await axios.post<any>(baseUrl, data, { headers });
    return response.data.choices[0].message.content;
};

const handleOllama = async (prompt: string, config: LLMConfig): Promise<string> => {
    const baseUrl = config.apiUrl || 'http://localhost:11434/api/generate';
    
    const data = {
        model: config.model || getDefaultModel('ollama'),
        system: SYSTEM_PROMPT,
        prompt: prompt,
        stream: false
    };

    const response = await axios.post<any>(baseUrl, data);
    return response.data.response;
};

const handleClaude = async (prompt: string, config: LLMConfig): Promise<string> => {
    const baseUrl = 'https://api.anthropic.com/v1/messages';
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
    };

    const data = {
        model: config.model || getDefaultModel('claude'),
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
            { role: 'user', content: prompt }
        ]
    };

    const response = await axios.post<any>(baseUrl, data, { headers });
    return response.data.content[0].text;
};

const handleGemini = async (prompt: string, config: LLMConfig): Promise<string> => {
    const model = config.model || getDefaultModel('gemini');
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
    
    const data = {
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
            { parts: [{ text: prompt }] }
        ]
    };

    const response = await axios.post<any>(baseUrl, data);
    return response.data.candidates[0].content.parts[0].text;
};
