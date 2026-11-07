import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';

interface Props {
  risk: string;
  reasons: string[];
  riskScore?: number;
}

export default function RiskIndicator({ risk, reasons, riskScore }: Props) {
  const normalizedRisk = (risk || 'Low').toLowerCase();

  const icon =
    normalizedRisk === 'high' ? (
      <ShieldAlert size={16} />
    ) : normalizedRisk === 'medium' ? (
      <AlertTriangle size={16} />
    ) : (
      <ShieldCheck size={16} />
    );

  return (
    <div className={`risk-indicator-card ${normalizedRisk}`}>
      <div className="risk-card-top">
        <div className="risk-label-group">
          <span className={`risk-icon-pill ${normalizedRisk}`}>{icon}</span>
          <div>
            <span className="risk-kicker">POSSIBLE CONFUSION</span>
            <h4 className="risk-headline">{risk} chance of confusion</h4>
          </div>
        </div>
        {typeof riskScore === 'number' && (
          <span className={`risk-score-badge ${normalizedRisk}`}>
            Score: {riskScore}/100
          </span>
        )}
      </div>

      {reasons && reasons.length > 0 && (
        <div className="risk-reasons-list">
          {reasons.map((r, i) => (
            <div key={i} className="risk-reason-item">
              <span className="risk-bullet" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
