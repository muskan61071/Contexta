import React, { useEffect, useState, useCallback } from 'react';
import { Home as HomeIcon, MessageSquare, Waypoints, History as HistoryIcon, BarChart3, BookOpen, ChevronRight } from 'lucide-react';
import type { Analysis, ContextMessage } from './types';
import { analyze, history, removeHistory, clearAllHistory } from './services/api';
import { useRealtimeStatus } from './hooks/useRealtimeStatus';
import RealtimeStatusBadge from './components/common/RealtimeStatusBadge';

// Page components
import HomePage from './pages/Home';
import ConversationAnalyzerPage from './pages/ConversationAnalyzer';
import HistoryPage from './pages/AnalysisHistory';
import DashboardPage from './pages/Dashboard';
import AboutPage from './pages/About';

const navigationItems = [
  ['Conversation Analyzer', MessageSquare],
  ['Overview', HomeIcon],
  ['Analysis history', HistoryIcon],
  ['Dashboard', BarChart3],
  ['About', BookOpen]
] as const;

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('Conversation Analyzer');
  const [initialText, setInitialText] = useState<string>('');
  const [initialContext, setInitialContext] = useState<ContextMessage[]>([]);
  const [result, setResult] = useState<Analysis | null>(null);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [savedAnalyses, setSavedAnalyses] = useState<Analysis[]>([]);
  const realtimeStatus = useRealtimeStatus(busy);

  // Load persistent history on mount
  const refreshHistory = useCallback(async () => {
    try {
      const records = await history();
      setSavedAnalyses(records);
    } catch {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  // Main NLP Analysis function
  const runAnalysis = async (msg: string, ctx: ContextMessage[] = []) => {
    if (!msg.trim()) {
      setError('Please enter a message to analyze.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const data = await analyze(msg, ctx);
      setResult(data);
      refreshHistory();
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : '';
      if (errMsg.toLowerCase().includes('failed to fetch') || errMsg.toLowerCase().includes('networkerror')) {
        setError('Contexta backend service is not running yet. Please ensure the backend server and NLP engine are started.');
      } else {
        setError(errMsg || 'Analysis failed. Please check backend connection.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSelectHistoricalAnalysis = (historical: Analysis) => {
    setResult(historical);
    setInitialText(historical.original);
    if (historical.context_used && historical.context_used.length > 0) {
      const ctx = historical.context_used.map((cu, idx) => ({
        id: `hist-${idx}`,
        speaker: 'Context',
        text: cu.text,
        timestamp: 'Prior turn'
      }));
      setInitialContext(ctx);
    }
    setCurrentPage('Conversation Analyzer');
  };

  const handleDeleteHistoricalAnalysis = async (id: string) => {
    try {
      await removeHistory(id);
      refreshHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await clearAllHistory();
      refreshHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const clearWorkspace = () => {
    setResult(null);
    setInitialText('');
    setInitialContext([]);
    setError('');
  };

  return (
    <div className="shell">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="brand" onClick={() => setCurrentPage('Conversation Analyzer')} style={{ cursor: 'pointer' }}>
          <div className="brand-mark">
            <Waypoints size={22} />
          </div>
          <div>
            <b>Contexta</b>
            <small>COMMUNICATION INTELLIGENCE</small>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE VIEWS</div>

        <nav>
          {navigationItems.map(([label, Icon]) => {
            const isActive = currentPage === label;
            return (
              <button
                key={label}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentPage(label)}
              >
                <Icon size={17} />
                <span>{label}</span>
                {label === 'Conversation Analyzer' && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="engine-card">
            <div>
              <b>Local NLP Engine Active</b>
              <small>Rule-based & semantic role pipeline</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Canvas */}
      <main className="main">
        {/* Topbar without any confusing private text boxes */}
        <header className="topbar">
          <div className="crumb">
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>{currentPage}</strong>
          </div>

          <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RealtimeStatusBadge status={realtimeStatus} />
            <div className="top-avatar" title="Contexta User">C</div>
          </div>
        </header>

        {/* Dynamic Page Router */}
        <div className="content">
          {currentPage === 'Conversation Analyzer' && (
            <ConversationAnalyzerPage
              result={result}
              busy={busy}
              error={error}
              onRunAnalysis={runAnalysis}
              onClearWorkspace={clearWorkspace}
              initialText={initialText}
              initialContext={initialContext}
            />
          )}

          {currentPage === 'Overview' && (
            <HomePage
              onAnalyze={() => setCurrentPage('Conversation Analyzer')}
            />
          )}

          {currentPage === 'Analysis history' && (
            <HistoryPage
              savedAnalyses={savedAnalyses}
              onSelectAnalysis={handleSelectHistoricalAnalysis}
              onDeleteAnalysis={handleDeleteHistoricalAnalysis}
              onClearAllHistory={handleClearAllHistory}
              onOpenAnalyzer={() => setCurrentPage('Conversation Analyzer')}
            />
          )}

          {currentPage === 'Dashboard' && (
            <DashboardPage
              savedAnalyses={savedAnalyses}
              onOpenAnalyzer={() => setCurrentPage('Conversation Analyzer')}
            />
          )}

          {currentPage === 'About' && <AboutPage />}
        </div>
      </main>
    </div>
  );
}
