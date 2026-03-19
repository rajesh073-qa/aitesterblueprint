import { useState } from 'react';
import { AppSettings, LLMProvider, ProviderSettings } from '../types';
import { Save, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  activeProvider: LLMProvider;
  setActiveProvider: (p: LLMProvider) => void;
}

export function Settings({ settings, setSettings, activeProvider, setActiveProvider }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const providers: LLMProvider[] = ['Ollama', 'LM Studio', 'Groq', 'OpenAI', 'Claude', 'Gemini'];

  const handleUpdate = (provider: LLMProvider, field: keyof ProviderSettings, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const currentConfig = localSettings[activeProvider];

  const handleSave = () => {
    setSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus('loading');
    try {
      const res = await fetch('http://localhost:3001/api/test_connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProvider,
          config: currentConfig
        })
      });
      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (e) {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  return (
    <div className="settings-view animate-fade">
      <div className="settings-header">
        <div className="settings-title">
          <h2>Configuration</h2>
          <p>Manage API keys, select models, and configure local LLM environments.</p>
        </div>
        <button className="btn-save" onClick={handleSave}>
          {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          <span>{saved ? 'Saved' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="settings-layout">
        <div className="provider-list panel">
          <div className="list-title">Providers</div>
          {providers.map(p => (
             <button 
               key={p} 
               className={`provider-item ${activeProvider === p ? 'active' : ''}`}
               onClick={() => setActiveProvider(p)}
             >
               <Cpu size={16} />
               <span>{p}</span>
             </button>
          ))}
        </div>

        <div className="provider-config panel">
          <div className="config-header">
            <h3>{activeProvider} Settings</h3>
            {['Ollama', 'LM Studio'].includes(activeProvider) ? (
              <span className="badge badge-local">Local Engine</span>
            ) : (
              <span className="badge badge-cloud">Cloud API</span>
            )}
          </div>

          <div className="config-body">
            {['Ollama', 'LM Studio'].includes(activeProvider) && (
              <div className="form-group">
                <label>API Base URL</label>
                <input 
                  type="text" 
                  value={currentConfig?.baseURL || ''} 
                  onChange={e => handleUpdate(activeProvider, 'baseURL', e.target.value)}
                  placeholder="e.g., http://localhost:11434"
                />
                <span className="helper-text">Ensure your local engine server is running.</span>
              </div>
            )}
            
            {['Groq', 'OpenAI', 'Claude', 'Gemini'].includes(activeProvider) && (
              <div className="form-group">
                <label>API Key</label>
                <div className="input-wrapper">
                   <input 
                     type="password" 
                     value={currentConfig?.apiKey || ''} 
                     onChange={e => handleUpdate(activeProvider, 'apiKey', e.target.value)}
                     placeholder={`Enter your ${activeProvider} API Key`}
                   />
                </div>
                <span className="helper-text">Keys are stored locally in your browser cache.</span>
              </div>
            )}

            <div className="form-group">
              <label>Model Timeline</label>
              <input 
                type="text" 
                value={currentConfig?.model || ''} 
                onChange={e => handleUpdate(activeProvider, 'model', e.target.value)}
                placeholder="e.g. gpt-4o, llama3"
              />
              <span className="helper-text">Specify the exact model version to target.</span>
            </div>
            
            <div className="test-action">
               <button 
                 className={`btn-test ${testStatus}`} 
                 onClick={handleTestConnection}
                 disabled={testStatus === 'loading'}
               >
                 {testStatus === 'loading' ? 'Testing...' :
                  testStatus === 'success' ? 'Connected Successfully' :
                  testStatus === 'error' ? 'Connection Failed' : 'Test Connection'}
               </button>
               {testStatus === 'error' && (
                 <div className="error-note">
                   <ShieldAlert size={16} />
                   Could not verify connection. Check credentials and network.
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-view {
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          height: 100%;
          overflow-y: auto;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
        }

        .settings-title h2 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .settings-title p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--text-primary);
          color: var(--bg-app);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .btn-save:hover {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
          align-items: flex-start;
        }

        .provider-list {
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 4px;
        }

        .list-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          padding: 8px 12px;
        }

        .provider-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          text-align: left;
          background: transparent;
        }

        .provider-item:hover {
          background: var(--bg-element);
          color: var(--text-primary);
        }

        .provider-item.active {
          background: var(--accent-light);
          color: var(--accent-color);
          font-weight: 600;
        }

        .provider-config {
          display: flex;
          flex-direction: column;
        }

        .config-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .config-header h3 {
          font-size: 1.15rem;
          margin: 0;
        }

        .badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .badge-local {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .badge-cloud {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .config-body {
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 600px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-group input {
          background: var(--bg-app);
          border: 1px solid var(--border-color);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .form-group input:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px var(--accent-light);
        }

        .helper-text {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        .test-action {
          margin-top: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-test {
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .btn-test:hover {
          background: var(--bg-element);
        }

        .btn-test.loading { opacity: 0.7; cursor: wait; }
        .btn-test.success { border-color: #22c55e; color: #4ade80; background: rgba(34, 197, 94, 0.1); }
        .btn-test.error { border-color: #ef4444; color: #f87171; background: rgba(239, 68, 68, 0.1); }

        .error-note {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f87171;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
