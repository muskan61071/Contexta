import React from 'react';
import { Shield, Info } from 'lucide-react';

interface Props {
  value: number;
  label: string;
}

export default function ConfidenceIndicator({ value, label }: Props) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  const strokeColor =
    label === 'High' ? '#10b981' : label === 'Medium' ? '#f59e0b' : '#ef4444';

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="confidence-indicator-card">
      <div className="confidence-meter-wrap">
        <svg className="confidence-svg-ring" width="56" height="56" viewBox="0 0 56 56">
          <circle
            className="ring-bg"
            cx="28"
            cy="28"
            r="22"
            fill="transparent"
            stroke="rgba(226, 232, 240, 0.8)"
            strokeWidth="5"
          />
          <circle
            className="ring-progress"
            cx="28"
            cy="28"
            r="22"
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 28 28)"
          />
        </svg>
        <div className="confidence-ring-label">
          <span className="conf-num">{normalizedValue}</span>
          <span className="conf-pct">%</span>
        </div>
      </div>

      <div className="confidence-info-content">
        <div className="conf-header-row">
          <span className="conf-kicker">ROUGH MATCH SCORE</span>
          <b className={`conf-level-badge ${label.toLowerCase()}`}>
            {label} Confidence
          </b>
        </div>
        <p className="conf-notice">
          This is a rough text-based score, not a probability. Check whether the suggested meaning fits your conversation.
        </p>
      </div>
    </div>
  );
}
