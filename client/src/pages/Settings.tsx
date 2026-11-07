import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Zap,
  Sliders,
  Database,
  Trash2,
  Download,
  CheckCircle2,
  HardDrive,
  Info
} from 'lucide-react';
import { clearAllHistory } from '../services/api';

interface Props {
  liveAnalysis: boolean;
  onLiveChange: (value: boolean) => void;
  debounceMs?: number;
  onDebounceChange?: (ms: number) => void;
  savedCount: number;
  onRefreshHistory: () => void;
}

export default function Settings({
  liveAnalysis,
  onLiveChange,
  debounceMs = 700,
  onDebounceChange,
  savedCount,
  onRefreshHistory
}: Props) {
  const [clearing, setClearing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [selectedDebounce, setSelectedDebounce] = useState(debounceMs);
  const [sensitivity, setSensitivity] = useState<'Balanced' | 'High' | 'Strict'>('Balanced');

  const handleClearHistory = async () => {
    if (!window.confirm('Delete all saved analyses from local SQLite storage?')) return;
    setClearing(true);
    try {
      await clearAllHistory();
      onRefreshHistory();
      setStatusMsg('Analysis history cleared successfully.');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (e) {
      setStatusMsg('Failed to clear history.');
    } finally {
      setClearing(false);
    }
  };

  const handleDebounceSelect = (ms: number) => {
    setSelectedDebounce(ms);
    if (onDebounceChange) onDebounceChange(ms);
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>APPLICATION PREFERENCES</span>
        </div>
        <h1>Settings & Engine Configuration</h1>
        <p>
          Configure discourse processing parameters, debounced live preview speeds, and local storage data management.
        </p>
      </div>

      <div className="settings-cards-stack">
        {/* Real-Time Processing Settings */}
        <div className="settings-card">
          <div className="settings-card-head">
            <div className="head-icon purple">
              <Zap size={18} />
            </div>
            <div>
              <h3>Real-Time Analysis Preferences</h3>
              <p>Configure how keystrokes trigger background discourse evaluation</p>
            </div>
          </div>

          <div className="settings-options-list">
            <label className="settings-toggle-row">
              <div className="toggle-copy">
                <b>Debounced Live Preview</b>
                <span>
                  Automatically re-evaluates the message in the background when typing pauses.
                </span>
              </div>
              <input
                type="checkbox"
                className="ios-switch"
                checked={liveAnalysis}
                onChange={(e) => onLiveChange(e.target.checked)}
              />
            </label>

            <div className="settings-control-row">
              <div className="control-copy">
                <b>Debounce Interval</b>
                <span>Millisecond pause required before triggering live preview:</span>
              </div>
              <div className="debounce-chips">
                {[300, 500, 700, 1000].map((ms) => (
                  <button
                    key={ms}
                    className={`chip-btn ${selectedDebounce === ms ? 'active' : ''}`}
                    onClick={() => handleDebounceSelect(ms)}
                  >
                    {ms}ms
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-control-row">
              <div className="control-copy">
                <b>Ambiguity Sensitivity Threshold</b>
                <span>Linguistic tolerance before flagging uncertain pronouns or polysemy:</span>
              </div>
              <div className="debounce-chips">
                {(['Balanced', 'High', 'Strict'] as const).map((s) => (
                  <button
                    key={s}
                    className={`chip-btn ${sensitivity === s ? 'active' : ''}`}
                    onClick={() => setSensitivity(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Local Storage & Privacy */}
        <div className="settings-card">
          <div className="settings-card-head">
            <div className="head-icon emerald">
              <Database size={18} />
            </div>
            <div>
              <h3>Local Database Management</h3>
              <p>Persistent storage powered by local SQLite database</p>
            </div>
          </div>

          <div className="settings-storage-info">
            <div className="storage-metric-row">
              <span className="metric-label">Database Engine:</span>
              <strong className="metric-value">SQLite (Local)</strong>
            </div>
            <div className="storage-metric-row">
              <span className="metric-label">Saved Analysis Records:</span>
              <strong className="metric-value">{savedCount} Record{savedCount === 1 ? '' : 's'}</strong>
            </div>
            <div className="storage-metric-row">
              <span className="metric-label">Privacy Model:</span>
              <strong className="metric-value green">100% Private (No external API calls)</strong>
            </div>
          </div>

          {statusMsg && (
            <div className="settings-status-box">
              <CheckCircle2 size={14} />
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="settings-danger-actions">
            <button
              className="danger-btn"
              onClick={handleClearHistory}
              disabled={clearing || savedCount === 0}
            >
              <Trash2 size={14} />
              <span>{clearing ? 'Clearing…' : 'Clear All Analysis History'}</span>
            </button>
          </div>
        </div>

        {/* Architecture Note */}
        <div className="settings-card privacy-guarantee">
          <div className="settings-card-head">
            <div className="head-icon blue">
              <Shield size={18} />
            </div>
            <div>
              <h3>Zero-Cloud Data Guarantee</h3>
              <p>Your communication data never leaves this machine</p>
            </div>
          </div>
          <p className="privacy-body">
            Contexta executes all syntactic parsing, coreference resolution, and semantic role labeling entirely within local processes (Express Gateway on port 5000, Python FastAPI on port 8000). No cloud LLM keys, analytics trackers, or third-party telemetry are utilized.
          </p>
        </div>
      </div>
    </div>
  );
}
