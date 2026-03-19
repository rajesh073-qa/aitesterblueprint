import { useState } from 'react';
import './App.css';

const BrandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

function App() {
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'settings'
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    provider: 'ollama',
    apiUrl: 'http://127.0.0.1:11434/api/generate',
    apiKey: '',
    model: ''
  });
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1, 
      role: 'ai', 
      content: 'Hello! I am Testcase genAI. Drop a Jira card or type your requirement to generate comprehensive test cases.'
    }
  ]);

  const [historyList, setHistoryList] = useState<{id: number, title: string}[]>([]);

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsGenerating(true);

    try {
      // 2. Call Backend
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirement: userMsg.content,
          config: aiConfig
        })
      });

      const data = await response.json();
      
      // 3. Render AI Response
      if (response.ok) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'ai',
          content: `Test cases generated with ${aiConfig.provider}:\n\n<div class="jira-output">${data.result}</div>`
        }]);
        setHistoryList(prev => [{ id: Date.now(), title: userMsg.content.substring(0, 30) + '...' }, ...prev]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'ai',
          content: `⚠️ Provider Error: ${data.details || data.error}`
        }]);
      }
    } catch (error) {
       setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'ai',
          content: '⚠️ Failed to connect to the local Testcase genAI backend.'
       }]);
    }

    setIsGenerating(false);
  };

  const handleTestConnection = async () => {
    setConnectionStatus("Testing connection...");
    try {
      const resp = await fetch('http://localhost:3001/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: aiConfig })
      });
      const data = await resp.json();
      setConnectionStatus(data.success ? '✅ Connection Successful!' : `❌ Provider Error: ${data.details || 'Connection Failed'}`);
    } catch {
      setConnectionStatus('❌ Backend unreachable.');
    }
    setTimeout(() => setConnectionStatus(null), 5000);
  };

  const handleSaveSettings = () => {
    setConnectionStatus('✅ Settings Saved!');
    setTimeout(() => setConnectionStatus(null), 3000);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* SVG gradients for icons */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
          <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#FF0099" />
          </linearGradient>
        </svg>

        <div className="brand">
          <BrandIcon />
          <span>Testcase genAI</span>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeView === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveView('chat')}
          >
            <ChatIcon />
            Test Generator
          </button>
          <button 
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            <SettingsIcon />
            AI Providers
          </button>
        </nav>

        <div className="history-section">
          <h4 className="history-title">History</h4>
          <div className="history-list">
            {historyList.map(item => (
              <div key={item.id} className="history-item">
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <h2 className="header-title">
            {activeView === 'chat' ? 'Generator Workspace' : 'Provider Settings'}
          </h2>
          <div className="connection-status">
            <div className="status-indicator"></div>
            <span>System Ready</span>
          </div>
        </header>

        {activeView === 'chat' ? (
          <>
            <div className="chat-area">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="bubble" dangerouslySetInnerHTML={{ __html: msg.content }} />
                </div>
              ))}
            </div>
            
            <div className="input-area">
              <div className="input-container">
                <textarea 
                  className="prompt-input"
                  placeholder="Drop a Jira card here or type your requirement..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                />
                <button className="send-btn" onClick={handleSend} title="Generate Test Cases" disabled={isGenerating}>
                  <SendIcon />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="settings-area">
            <div className="settings-card">
              <h3 style={{ marginBottom: '32px', fontSize: '1.4rem' }}>Configure Provider</h3>
              
              <div className="settings-group">
                <label className="settings-label">Active Provider</label>
                <select 
                  className="settings-input" 
                  value={aiConfig.provider}
                  onChange={e => setAiConfig({...aiConfig, provider: e.target.value})}
                  style={{ backgroundColor: 'var(--panel-bg)', cursor: 'pointer' }}
                >
                  <option value="ollama">Ollama (Local)</option>
                  <option value="groq">Groq SDK</option>
                  <option value="openai">OpenAI</option>
                  <option value="claude">Claude</option>
                  <option value="gemini">Gemini</option>
                  <option value="llmstudio">LLM Studio Local</option>
                </select>
              </div>

              {(aiConfig.provider === 'ollama' || aiConfig.provider === 'llmstudio') && (
                <div className="settings-group">
                  <label className="settings-label">API URL</label>
                  <input 
                    type="text" 
                    className="settings-input" 
                    value={aiConfig.apiUrl}
                    onChange={e => setAiConfig({...aiConfig, apiUrl: e.target.value})}
                    placeholder="http://127.0.0.1:..." 
                  />
                </div>
              )}

              {(['groq', 'openai', 'claude', 'gemini'].includes(aiConfig.provider)) && (
                <div className="settings-group">
                  <label className="settings-label">API Key</label>
                  <input 
                    type="password" 
                    className="settings-input" 
                    value={aiConfig.apiKey}
                    onChange={e => setAiConfig({...aiConfig, apiKey: e.target.value})}
                    placeholder="Enter auth key..." 
                  />
                </div>
              )}

              <div className="settings-group">
                <label className="settings-label">Model (Optional)</label>
                <input 
                  type="text" 
                  className="settings-input" 
                  value={aiConfig.model}
                  onChange={e => setAiConfig({...aiConfig, model: e.target.value})}
                  placeholder="Leave blank for default" 
                />
              </div>

              <div className="settings-actions">
                {connectionStatus && <span style={{ marginRight: 'auto', alignSelf: 'center', color: connectionStatus.includes('❌') ? '#ff4b4b' : 'var(--accent-color)' }}>{connectionStatus}</span>}
                <button className="btn-secondary" onClick={handleTestConnection}>Test Connection</button>
                <button className="btn-primary" onClick={handleSaveSettings}>Save Settings</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
