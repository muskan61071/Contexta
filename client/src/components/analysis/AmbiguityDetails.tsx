import React from 'react';
import {
  Check,
  AlertCircle,
  HelpCircle,
  Tag,
  ShieldCheck,
  MessageSquareQuote,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import type { Ambiguity } from '../../types';

interface Props {
  items: Ambiguity[];
}

const kindColorMap: Record<string, { bg: string; text: string; border: string }> = {
  'Unclear reference': { bg: 'rgba(99, 102, 241, 0.12)', text: '#4338ca', border: '#818cf8' },
  'Word with more than one meaning': { bg: 'rgba(245, 158, 11, 0.12)', text: '#b45309', border: '#fbbf24' },
  'Sentence that can be grouped in different ways': { bg: 'rgba(168, 85, 247, 0.12)', text: '#7e22ce', border: '#c084fc' },
  'Missing details': { bg: 'rgba(239, 68, 68, 0.12)', text: '#b91c1c', border: '#f87171' },
  'Pronoun': { bg: 'rgba(99, 102, 241, 0.12)', text: '#4338ca', border: '#818cf8' },
  'Lexical': { bg: 'rgba(245, 158, 11, 0.12)', text: '#b45309', border: '#fbbf24' },
  'Syntactic': { bg: 'rgba(168, 85, 247, 0.12)', text: '#7e22ce', border: '#c084fc' }
};

function getKindStyle(kindStr: string) {
  for (const [key, val] of Object.entries(kindColorMap)) {
    if (kindStr.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { bg: 'rgba(100, 116, 139, 0.12)', text: '#334155', border: '#94a3b8' };
}

export default function AmbiguityDetails({ items }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="ambiguity-empty-note">
        <Check size={16} />
        <span>No ambiguous elements detected. The message is clear!</span>
      </div>
    );
  }

  return (
    <div className="ambiguity-details-container">
      {items.map((item, idx) => {
        const displayKind = item.kind || item.type;
        const kindStyle = getKindStyle(displayKind);
        const hasEvidence = Boolean(item.has_enough_evidence ?? item.resolved);
        const meanings = item.possible_meanings && item.possible_meanings.length > 0
          ? item.possible_meanings
          : item.candidates || [];

        return (
          <div key={`${item.expression}-${idx}`} className="ambiguity-detail-card">
            {/* Header: What is unclear & Kind of ambiguity */}
            <div className="amb-detail-header">
              <div className="amb-expr-group">
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>What is unclear:</span>
                <code className="amb-expr-pill">“{item.expression}”</code>
                <span
                  className="amb-type-badge"
                  style={{
                    backgroundColor: kindStyle.bg,
                    color: kindStyle.text,
                    border: `1px solid ${kindStyle.border}`
                  }}
                >
                  <Tag size={10} />
                  {displayKind}
                </span>
              </div>

              <div className="amb-status-group">
                {hasEvidence ? (
                  <span className="amb-resolved-pill">
                    <ShieldCheck size={13} />
                    <span>Enough evidence found</span>
                  </span>
                ) : (
                  <span className="amb-unresolved-pill">
                    <AlertCircle size={13} />
                    <span>Not enough evidence</span>
                  </span>
                )}
                <span className="amb-conf-tag">{item.confidence}% Match Evidence</span>
              </div>
            </div>

            {/* Simple explanation */}
            <p className="amb-reason-text">{item.reason}</p>

            {/* Possible meanings or missing information */}
            {meanings.length > 0 && (
              <div className="amb-candidates-wrapper" style={{ alignItems: 'flex-start', marginTop: '4px' }}>
                <span className="candidates-label-small" style={{ minWidth: '120px' }}>Possible meanings:</span>
                <div className="candidates-chips">
                  {meanings.map((meaning, mIdx) => {
                    const isSelected = item.resolved && meaning.toLowerCase().includes(item.resolved.toLowerCase());
                    return (
                      <span
                        key={mIdx}
                        className={`candidate-eval-chip ${isSelected ? 'winner' : ''}`}
                      >
                        {isSelected && <Check size={11} />}
                        <span>{meaning}</span>
                        {isSelected && <span className="winner-tag">Supported</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Earlier conversation evidence (if any) */}
            <div style={{ marginTop: '6px', fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span className="candidates-label-small" style={{ minWidth: '120px' }}>Evidence from conversation:</span>
              {item.evidence_message ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  color: 'var(--text-main)'
                }}>
                  <MessageSquareQuote size={12} color="#10b981" />
                  <em>“{item.evidence_message}”</em>
                </div>
              ) : (
                <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No earlier message provides evidence for this.
                </span>
              )}
            </div>

            {/* Clarification question (when evidence is not enough) */}
            {!hasEvidence && item.clarification_question && (
              <div style={{
                marginTop: '8px',
                padding: '8px 10px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px'
              }}>
                <QuestionIcon size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                <div>
                  <b style={{ color: '#b45309', marginRight: '6px' }}>Question to ask:</b>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                    {item.clarification_question}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
