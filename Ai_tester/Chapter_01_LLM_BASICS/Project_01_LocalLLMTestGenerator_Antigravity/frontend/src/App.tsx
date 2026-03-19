import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainChat } from './components/MainChat';
import { Settings } from './components/Settings';
import { ChatSession, LLMProvider, AppSettings, ChatMessage } from './types';
import './index.css';

const defaultSettings: AppSettings = {
  'Ollama': { baseURL: 'http://localhost:11434', model: 'llama3' },
  'LM Studio': { baseURL: 'http://localhost:1234/v1', model: 'local-model' },
  'Groq': { apiKey: '', model: 'llama3-70b-8192' },
  'OpenAI': { apiKey: '', model: 'gpt-4o' },
  'Claude': { apiKey: '', model: 'claude-3-opus-20240229' },
  'Gemini': { apiKey: '', model: 'gemini-1.5-pro' },
};

function App() {
  const [view, setView] = useState<'chat' | 'settings'>('chat');
  
  // Try to load state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('testcase_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('llm_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [activeProvider, setActiveProvider] = useState<LLMProvider>('Ollama');

  // Persist State
  useEffect(() => {
    localStorage.setItem('testcase_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('llm_settings', JSON.stringify(settings));
  }, [settings]);

  // Derived state
  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const handleNewSession = () => {
    setActiveSessionId(null);
    setView('chat');
  };

  const handleUpdateSession = (sessionId: string | null, newMessages: ChatMessage[], newTitle?: string) => {
    if (!sessionId) {
      // Create new
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: newTitle || newMessages[0]?.content.substring(0, 40) || 'New Conversation',
        messages: newMessages,
        provider: activeProvider,
        model: settings[activeProvider].model || 'unknown',
        updatedAt: new Date().toISOString()
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newId);
    } else {
      // Update existing
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: newMessages,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      }));
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setView('chat');
    }
  };

  return (
    <div className="layout">
      <Sidebar 
        view={view}
        setView={setView}
        sessions={sessions} 
        activeId={activeSessionId} 
        onSelect={(id: string) => {
          setActiveSessionId(id);
          setView('chat');
        }} 
        onNew={handleNewSession}
        onDelete={handleDeleteSession}
      />

      <main className="content">
        {view === 'chat' ? (
          <MainChat 
            activeProvider={activeProvider}
            activeSession={activeSession}
            settings={settings}
            onUpdateSession={handleUpdateSession}
          />
        ) : (
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            activeProvider={activeProvider}
            setActiveProvider={setActiveProvider}
          />
        )}
      </main>

      <style>{`
        .layout {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: var(--bg-app);
          overflow: hidden;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: var(--bg-app);
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default App;
