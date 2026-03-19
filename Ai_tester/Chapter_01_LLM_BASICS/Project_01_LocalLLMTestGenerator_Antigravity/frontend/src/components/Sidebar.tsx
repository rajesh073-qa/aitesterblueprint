import { ChatSession } from '../types';
import { Plus, MessageSquare, Settings, BrainCircuit, Trash2 } from 'lucide-react';

interface SidebarProps {
  view: 'chat' | 'settings';
  setView: (v: 'chat' | 'settings') => void;
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ view, setView, sessions, activeId, onSelect, onNew, onDelete }: SidebarProps) {
  // Group sessions
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-box">
          <BrainCircuit size={22} color="var(--bg-app)" />
        </div>
        <div>
          <h2>TestGenius</h2>
          <span className="badge">AI Generator</span>
        </div>
      </div>

      <div className="sidebar-actions">
        <button className="btn-new" onClick={onNew}>
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <div className="sidebar-nav">
        <div className="nav-group-title">Navigation</div>
        <button 
          className={`nav-item ${view === 'chat' && !activeId ? 'active' : ''}`}
          onClick={onNew}
        >
          <MessageSquare size={18} />
          Generator
        </button>
        <button 
          className={`nav-item ${view === 'settings' ? 'active' : ''}`}
          onClick={() => setView('settings')}
        >
          <Settings size={18} />
          Configurations
        </button>
      </div>

      <div className="sidebar-history-wrapper">
        <div className="nav-group-title">
          Chat History
        </div>
        
        <div className="sidebar-history">
          {sortedSessions.length === 0 ? (
            <div className="history-empty">No active conversations.</div>
          ) : (
            sortedSessions.map(item => (
              <div 
                key={item.id}
                className={`history-btn-wrapper ${item.id === activeId && view === 'chat' ? 'active' : ''}`}
              >
                <button
                  className="history-btn"
                  onClick={() => onSelect(item.id)}
                  title={item.title}
                >
                  <div className="history-text">{item.title}</div>
                  <div className="history-meta">{item.provider} &middot; {new Date(item.updatedAt).toLocaleDateString()}</div>
                </button>
                <button 
                  className="delete-session-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  title="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          display: flex;
          flex-direction: column;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          padding: 0;
          height: 100vh;
          flex-shrink: 0;
        }

        .sidebar-brand {
          padding: 24px 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-box {
          background: var(--text-primary);
          height: 36px;
          width: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-brand h2 {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }

        .badge {
          background: var(--accent-light);
          color: var(--accent-color);
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .sidebar-actions {
          padding: 0 20px 16px;
        }

        .btn-new {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--text-primary);
          color: var(--bg-app);
          padding: 10px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .btn-new:hover {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        .sidebar-nav {
          padding: 0 12px 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-group-title {
          padding: 0 12px;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          margin: 16px 0 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          text-align: left;
        }

        .nav-item:hover {
          background: var(--bg-element);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--bg-element-hover);
          color: var(--text-primary);
        }

        .sidebar-history-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0 12px 12px;
          overflow: hidden;
        }

        .sidebar-history {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .history-empty {
          padding: 12px;
          color: var(--text-tertiary);
          font-size: 0.85rem;
          text-align: center;
        }

        .history-btn-wrapper {
          display: flex;
          align-items: center;
          border-radius: var(--radius-md);
          width: 100%;
          transition: all 0.1s;
        }

        .history-btn-wrapper:hover {
          background: var(--bg-element);
        }

        .history-btn-wrapper.active {
          background: var(--accent-light);
        }

        .history-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 12px;
          text-align: left;
          flex: 1;
          gap: 4px;
          min-width: 0;
        }

        .delete-session-btn {
          padding: 12px;
          color: var(--text-tertiary);
          border-radius: var(--radius-md);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .history-btn-wrapper:hover .delete-session-btn {
          opacity: 1;
        }

        .delete-session-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .history-text {
          font-size: 0.85rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          font-weight: 500;
        }
        
        .history-btn-wrapper.active .history-text {
          color: var(--accent-color);
        }

        .history-meta {
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}
