import { useState, useRef, useEffect } from 'react';
import { ChatSession, LLMProvider, AppSettings, ChatMessage } from '../types';
import { Send, Loader2, Bot, AlertTriangle, Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MainChatProps {
  activeProvider: LLMProvider;
  activeSession: ChatSession | null;
  settings: AppSettings;
  onUpdateSession: (sessionId: string | null, messages: ChatMessage[], title?: string) => void;
}

export function MainChat({ activeProvider, activeSession, settings, onUpdateSession }: MainChatProps) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorLine, setErrorLine] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const providerConfig = settings[activeProvider];
  const messages = activeSession?.messages || [];

  const validateSettings = () => {
    if (['Ollama', 'LM Studio'].includes(activeProvider)) {
      if (!providerConfig.baseURL) return 'Base URL is required for local providers.';
    } else {
      if (!providerConfig.apiKey) return `${activeProvider} API Key is missing. Configure it in Settings.`;
    }
    if (!providerConfig.model) return 'Model name is missing in settings.';
    return null;
  };

  const handleSubmit = async () => {
    if (!input.trim() || isGenerating) return;

    const validationError = validateSettings();
    if (validationError) {
       setErrorLine(validationError);
       return;
    }
    setErrorLine(null);
    setIsGenerating(true);
    
    // Add user message to session
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, newMessage];
    const sessionId = activeSession?.id || null;
    
    // Update frontend state immediately to show user's chat bubble
    onUpdateSession(sessionId, updatedMessages);
    setInput('');

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProvider,
          config: providerConfig,
          messages: updatedMessages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate.');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date().toISOString()
      };

      onUpdateSession(sessionId, [...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error(error);
      setErrorLine('Network Error: Failed to connect to Backend Server.');
      // Keep user message but remove loading state if failed.
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Adjust textarea height
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
    if (errorLine) setErrorLine(null);
  };

  return (
    <div className="chat-view">
      {/* Header bar */}
      <div className="chat-header">
        <div className="header-title">
          <Bot size={20} color="var(--accent-color)" />
          <h3>{activeSession ? activeSession.title : 'New Generative Session'}</h3>
        </div>
        <div className="header-meta">
          Model: <span className="highlight tag">{activeSession?.provider || activeProvider} ({activeSession?.model || providerConfig.model})</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="chat-content">
        {messages.length === 0 ? (
          <div className="empty-state animate-fade">
             <div className="empty-icon">
                <Sparkles size={40} color="var(--accent-color)" />
             </div>
             <h2>How can I help you test today?</h2>
             <p>Have an ongoing conversation with TestGenius. Paste a Jira requirement and ask for follow-ups, refinements, or additional functional scopes.</p>
          </div>
        ) : (
          <div className="messages-stream">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.role} animate-fade`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="message-bubble">
                  {msg.role === 'user' ? (
                     <div className="user-text">{msg.content}</div>
                  ) : (
                     <div className="markdown-body">
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isGenerating && (
          <div className="message-row assistant animate-fade">
             <div className="message-avatar">
               <Bot size={18} />
             </div>
             <div className="message-bubble loading-bubble">
                <Loader2 className="spinner" size={20} color="var(--accent-color)" />
                <span>Thinking...</span>
             </div>
          </div>
        )}
        <div ref={endRef} style={{ height: '40px' }} />
      </div>

      {/* Input Anchored at Bottom */}
      <div className="chat-footer">
        {errorLine && (
           <div className="alert alert-error">
             <AlertTriangle size={18} />
             {errorLine}
           </div>
        )}
        
        <div className="input-container panel">
          <textarea 
            placeholder={messages.length === 0 ? `Ask ${activeProvider} to generate Jira test cases...` : "Follow up request..."}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isGenerating}
            rows={1}
          />
          <button 
            className="btn-send" 
            onClick={handleSubmit} 
            disabled={!input.trim() || isGenerating}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="footer-disclaimer">
          TestGenius outputs strictly conform to Jira reporting markdown rules.
        </div>
      </div>

      <style>{`
        .chat-view {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          background: rgba(9, 9, 11, 0.8);
          backdrop-filter: blur(12px);
          z-index: 10;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-title h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary);
        }

        .header-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tag {
          background: var(--bg-element);
          padding: 4px 8px;
          border-radius: 6px;
          color: var(--text-primary);
          font-weight: 500;
          border: 1px solid var(--border-color);
        }

        .chat-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 40px;
          scroll-behavior: smooth;
        }

        .empty-state {
          max-width: 500px;
          margin: 120px auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .empty-icon {
          height: 70px;
          width: 70px;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          background: var(--bg-element);
          border: 1px solid var(--border-color);
        }

        .empty-state h2 {
          font-size: 1.4rem;
        }

        .empty-state p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .messages-stream {
          display: flex;
          flex-direction: column;
          padding-top: 24px;
        }

        .message-row {
          display: flex;
          padding: 24px 0;
          gap: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.02);
        }

        .message-row.user {
          justify-content: flex-end;
          padding-right: 40px;
          padding-left: 20%;
        }

        .message-row.assistant {
          justify-content: flex-start;
          padding-left: 40px;
          padding-right: 15%;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-row.user .message-avatar {
          background: var(--bg-panel);
          color: var(--text-secondary);
          order: 2; /* Put avatar on the right for user */
        }

        .message-row.assistant .message-avatar {
          background: var(--accent-color);
          color: white;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.4);
        }

        .message-bubble {
          max-width: 100%;
        }
        
        .message-row.user .message-bubble {
          background: var(--bg-panel);
          padding: 12px 18px;
          border-radius: 16px;
          border-top-right-radius: 4px;
        }

        .user-text {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--text-primary);
          white-space: pre-wrap;
        }
        
        .loading-bubble {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          padding-top: 6px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .chat-footer {
          padding: 16px 40px 24px;
          background: var(--bg-app);
          z-index: 10;
          flex-shrink: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .input-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 10px 14px;
          transition: border-color 0.2s;
          background: var(--bg-sidebar);
          border-radius: 20px;
        }

        .input-container:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 2px var(--accent-light);
        }

        .input-container textarea {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.95rem;
          resize: none;
          line-height: 1.5;
          padding: 8px 4px;
          margin: 0;
          max-height: 200px;
        }

        .input-container textarea::placeholder {
          color: var(--text-tertiary);
        }

        .btn-send {
          background: var(--text-primary);
          color: var(--bg-app);
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 4px;
        }

        .btn-send:hover:not(:disabled) {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        .btn-send:disabled {
          background: var(--bg-element);
          color: var(--text-tertiary);
          cursor: not-allowed;
          transform: none;
        }

        .footer-disclaimer {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
