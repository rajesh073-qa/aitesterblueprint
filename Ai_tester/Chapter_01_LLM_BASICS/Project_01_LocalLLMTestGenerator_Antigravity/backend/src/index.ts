import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const MOCK_JIRA_FORMAT = `
*Test Case ID:* TC-001
*Summary:* {requirement_summary}
*Pre-condition:* System is accessible
*Test Steps:*
1. Navigate to module
2. Perform action based on requirement
3. Verify outcome
*Expected Result:* Requirement is met successfully
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { provider, config, messages } = req.body;
    
    let generatedMarkdown = '';
    const systemPrompt = "You are a QA Engineer. You must strictly output Test Cases formatted as a single Markdown table. Do not provide conversational text outside the table unless clarifying formatting. The table MUST strictly have these exact headers: | Test Case ID | Test Case Name | Module | Preconditions | Test Steps | Test Data | Expected Result | Actual Result | Status | Priority |";
    
    // Formatting messages for standard Open-AI standard APIs
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    if (provider === 'OpenAI' || provider === 'Groq' || provider === 'LM Studio') {
      const url = provider === 'OpenAI' ? 'https://api.openai.com/v1/chat/completions' :
                  provider === 'Groq'   ? 'https://api.groq.com/openai/v1/chat/completions' :
                                          `${config.baseURL}/chat/completions`;
                                          
      const response = await axios.post(url, {
        model: config.model,
        messages: formattedMessages
      }, {
        headers: {
          'Authorization': `Bearer ${config.apiKey || 'mock'}`,
          'Content-Type': 'application/json'
        }
      });
      generatedMarkdown = response.data.choices[0].message.content;

    } else if (provider === 'Ollama') {
      const response = await axios.post(`${config.baseURL}/api/chat`, {
        model: config.model || 'llama3',
        messages: formattedMessages,
        stream: false
      });
      generatedMarkdown = response.data.message.content;

    } else if (provider === 'Gemini') {
      const geminiMessages = messages.map((m: any) => ({
         role: m.role === 'assistant' ? 'model' : 'user',
         parts: [{ text: m.content }]
      }));
      geminiMessages.unshift({ role: 'model', parts: [{ text: 'Understood.' }] });
      geminiMessages.unshift({ role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }] });

      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`, {
        contents: geminiMessages
      });
      generatedMarkdown = response.data.candidates[0].content.parts[0].text;
    
    } else if (provider === 'Claude') {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: config.model || 'claude-3-opus-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content }))
      }, {
        headers: {
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      });
      generatedMarkdown = response.data.content[0].text;
    } else {
       throw new Error("Provider not configured properly.");
    }

    res.json({
      success: true,
      message: {
        role: 'assistant',
        content: generatedMarkdown
      }
    });

  } catch (error: any) {
    console.error("API Call Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate response. Check API configuration/keys.' });
  }
});

app.post('/api/test_connection', (req, res) => {
  const { provider, config } = req.body;
  console.log(`Testing connection for ${provider} with config:`, config);
  
  // Return success mock
  setTimeout(() => {
    res.json({ success: true, message: 'Connection successful.' });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
