import React, { useState } from 'react';
import { RefreshCw, Server } from 'lucide-react';
import type { RealtimeStatus } from '../../hooks/useRealtimeStatus';

interface Props {
  status: RealtimeStatus & { refresh: () => void };
}

export default function RealtimeStatusBadge({ status }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const isConnected = status.status === 'connected';
  const isSyncing = status.status === 'syncing';
  const isOffline = status.status === 'offline';

  return (
    <div className="realtime-status-wrapper">
      <button
        className={`realtime-status-pill ${status.status}`}
        onClick={() => setShowDetails(!showDetails)}
        title="Check whether the app services are running"
        aria-label="App service status"
      >
        <span className={`status-beacon ${status.status}`}>
          <span className="beacon-ping" />
          <span className="beacon-core" />
        </span>

        <span className="status-label">
          {isSyncing ? 'Checking services…' : isConnected ? 'Ready to analyze' : 'Services offline'}
        </span>

        {isConnected && (
          <span className="latency-badge">{status.latencyMs}ms</span>
        )}
      </button>

      {showDetails && (
        <div className="realtime-details-popover">
          <div className="rdp-header">
            <Server size={14} />
            <b>App service status</b>
            <button className="rdp-close" onClick={() => setShowDetails(false)}>×</button>
          </div>

          <div className="rdp-rows">
            <div className="rdp-row">
              <span>Status:</span>
              <strong className={isConnected ? 'green-text' : 'red-text'}>
                {isConnected ? 'Ready' : 'Not ready'}
              </strong>
            </div>

            <div className="rdp-row">
              <span>Response time:</span>
              <span>{status.latencyMs} ms</span>
            </div>

            <div className="rdp-row">
              <span>API Gateway:</span>
              <code>http://localhost:5000</code>
            </div>

            <div className="rdp-row">
              <span>NLP Service:</span>
              <code>http://localhost:8000</code>
            </div>

            <div className="rdp-row">
              <span>Storage:</span>
              <span>Local SQLite3</span>
            </div>

            <div className="rdp-row">
              <span>Last Heartbeat:</span>
              <span>{status.lastChecked.toLocaleTimeString()}</span>
            </div>
          </div>

          {isOffline && (
            <p className="rdp-help">
              {status.error || 'One or more services are offline.'} Open the main project folder and double-click <b>START-CONTEXTA.bat</b>.
            </p>
          )}

          <div className="rdp-footer">
            <button className="rdp-refresh-btn" onClick={status.refresh}>
              <RefreshCw size={12} /> Check again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
