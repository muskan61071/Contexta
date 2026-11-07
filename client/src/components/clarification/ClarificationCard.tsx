import React, { useState } from 'react';
import { HelpCircle, ArrowRight, Check, Sparkles, AlertCircle, Send } from 'lucide-react';
import type { Analysis, ClarificationDetail } from '../../types';

interface Props {
  analysis: Analysis;
  onApplyClarification: (updatedMessage: string, clarifyingFact?: string) => void;
}

export default function ClarificationCard({ analysis, onApplyClarification }: Props) {
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const details = analysis.clarification_details || [];
  const questions = analysis.clarifications || [];

  if (questions.length === 0 && details.length === 0) {
    return (
      <div className="clarification-none">
        <div className="clarification-none-icon">
          <Check size={18} />
        </div>
        <div>
          <b>All references sufficiently supported</b>
          <p>The app did not find a question to ask. Review the suggested meaning and rewrite before using them.</p>
        </div>
      </div>
    );
  }

  const handleSelectOption = (expression: string, choice: string) => {
    setSelectedOptions((prev) => ({ ...prev, [expression]: choice }));
    // Substitute the ambiguous expression with the user's explicit choice
    const regex = new RegExp(`\\b${escapeRegExp(expression)}\\b`, 'i');
    let updated = analysis.original;
    if (regex.test(updated)) {
      updated = updated.replace(regex, choice);
    } else {
      updated = `${analysis.original} (${expression} = ${choice})`;
    }
    const fact = `${choice} is the intended referent for “${expression}”.`;
    onApplyClarification(updated, fact);
  };

  const handleCustomSubmit = (expression: string) => {
    const customVal = customAnswers[expression]?.trim();
    if (!customVal) return;
    handleSelectOption(expression, customVal);
  };

  return (
    <div className="clarification-assistant-card">
      <div className="clarification-card-header">
        <div className="clarification-badge-icon">
          <HelpCircle size={18} />
        </div>
        <div>
          <h3>Question to ask</h3>
          <p>Choose the option that matches what you mean, or type your own answer.</p>
        </div>
        <span className="clarification-count-pill">
          {Math.max(questions.length, details.length)} question{Math.max(questions.length, details.length) === 1 ? '' : 's'}
        </span>
      </div>

      <div className="clarification-questions-list">
        {details.length > 0 ? (
          details.map((item, idx) => (
            <div key={item.id || idx} className="clarification-question-block">
              <div className="question-info-row">
                <span className="question-target-expr">“{item.expression}”</span>
                <span className="question-type-tag">{item.type}</span>
              </div>

              <h4 className="question-title">{item.question}</h4>

              {/* Selectable candidate options extracted from context */}
              {item.options && item.options.length > 0 && (
                <div className="clarification-candidates-group">
                  <span className="candidates-label">Suggested from conversation:</span>
                  <div className="candidates-button-row">
                    {item.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        className={`candidate-choice-btn ${
                          selectedOptions[item.expression] === opt ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectOption(item.expression, opt)}
                      >
                        <Sparkles size={11} />
                        <span>{opt}</span>
                        <ArrowRight size={11} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Write-In Option */}
              <div className="clarification-custom-row">
                <input
                  className="clarification-custom-input"
                  placeholder={`Or type who/what “${item.expression}” refers to…`}
                  value={customAnswers[item.expression] || ''}
                  onChange={(e) =>
                    setCustomAnswers({ ...customAnswers, [item.expression]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCustomSubmit(item.expression);
                  }}
                />
                <button
                  className="clarification-submit-btn"
                  onClick={() => handleCustomSubmit(item.expression)}
                  disabled={!customAnswers[item.expression]?.trim()}
                  title="Resolve and re-run analysis"
                >
                  <Send size={12} /> Resolve
                </button>
              </div>
            </div>
          ))
        ) : (
          questions.map((q, idx) => {
            const targetAmb = analysis.ambiguities.find(
              (a) => !a.resolved && q.toLowerCase().includes(a.expression.toLowerCase())
            );
            const expr = targetAmb ? targetAmb.expression : 'it';
            const opts = targetAmb?.candidates || [];

            return (
              <div key={idx} className="clarification-question-block">
                <h4 className="question-title">{q}</h4>
                {opts.length > 0 && (
                  <div className="candidates-button-row">
                    {opts.map((opt, i) => (
                      <button
                        key={i}
                        className="candidate-choice-btn"
                        onClick={() => handleSelectOption(expr, opt)}
                      >
                        <span>{opt}</span>
                        <ArrowRight size={11} />
                      </button>
                    ))}
                  </div>
                )}
                <div className="clarification-custom-row">
                  <input
                    className="clarification-custom-input"
                    placeholder="Type explicit clarification…"
                    value={customAnswers[expr] || ''}
                    onChange={(e) => setCustomAnswers({ ...customAnswers, [expr]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCustomSubmit(expr);
                    }}
                  />
                  <button
                    className="clarification-submit-btn"
                    onClick={() => handleCustomSubmit(expr)}
                    disabled={!customAnswers[expr]?.trim()}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="clarification-footer-hint">
        <AlertCircle size={13} />
        <span>
          Your choice updates the message and runs the check again.
        </span>
      </div>
    </div>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
