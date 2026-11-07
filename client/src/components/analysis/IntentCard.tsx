import React from 'react';
import { Brain, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import type { Analysis, Interpretation } from '../../types';

interface Props {
  analysis: Analysis;
}

export default function IntentCard({ analysis }: Props) {
  const { intent, original, interpretations, confidence } = analysis;

  const hasIntent = Boolean(intent);

  return (
    <div className="intent-card-container">
      {/* Primary Supported Reading Banner */}
      <div className={`intent-primary-banner ${hasIntent ? 'supported' : 'unresolved'}`}>
        <div className="intent-banner-top">
          <span className="intent-badge-pill">
            {hasIntent ? (
              <>
                <ShieldCheck size={13} />
                <span>LIKELY MEANING — PLEASE CHECK</span>
              </>
            ) : (
              <>
                <AlertTriangle size={13} />
                <span>WE NEED MORE CONTEXT</span>
              </>
            )}
          </span>
          <span className="intent-confidence-badge">
            {confidence}% rough evidence score
          </span>
        </div>

        <h3 className="intent-primary-text">
          {hasIntent ? (
            `“${intent}”`
          ) : (
            'Contexta is not sure what this means. Add earlier messages or answer the question below.'
          )}
        </h3>

        {hasIntent && (
          <div className="intent-meta-comparison">
            <span className="intent-sub-label">Original utterance:</span>
            <span className="intent-orig-quote">“{original}”</span>
          </div>
        )}
      </div>

      {/* Alternative Interpretations whenever available */}
      {interpretations && interpretations.length > 0 && (
        <div className="intent-alternatives-section">
          <div className="alternatives-header">
            <div className="alt-title-row">
              <Layers size={14} />
              <h4>Other possible meanings</h4>
            </div>
            <span className="alt-count">{interpretations.length} option{interpretations.length === 1 ? '' : 's'}</span>
          </div>

          <div className="alternatives-list">
            {interpretations.map((interp, idx) => {
              const isTop = idx === 0 && hasIntent;
              return (
                <div
                  key={idx}
                  className={`alternative-item-card ${isTop ? 'primary-candidate' : 'secondary-candidate'}`}
                >
                  <div className="alt-card-top">
                    <div className="alt-rank-tag">
                      <span className="rank-num">Option {idx + 1}</span>
                      <b className="alt-meaning-title">{interp.meaning}</b>
                    </div>
                    <div className="alt-score-badge">
                      <span className="score-val">{interp.confidence}%</span>
                      <div className="alt-mini-bar-track">
                        <div
                          className="alt-mini-bar-fill"
                          style={{ width: `${interp.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Supporting Context Quotes */}
                  <div className="alt-evidence-section">
                    <div className="evidence-grid-item">
                        <span className="ev-label support">CLUES FROM EARLIER MESSAGES:</span>
                      {interp.support && interp.support.length > 0 ? (
                        <div className="ev-quotes-list">
                          {interp.support.map((s, sIdx) => (
                            <span key={sIdx} className="ev-quote-pill">
                              “{s}”
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="ev-none-text">No clear clue found in earlier messages.</span>
                      )}
                    </div>

                    {/* Conflicting Context if any */}
                    {interp.conflict && interp.conflict.length > 0 && (
                      <div className="evidence-grid-item conflict">
                        <span className="ev-label conflict">CONFLICTING CONTEXT:</span>
                        <div className="ev-quotes-list">
                          {interp.conflict.map((c, cIdx) => (
                            <span key={cIdx} className="ev-quote-pill conflict">
                              “{c}”
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
