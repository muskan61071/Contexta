import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  Info
} from 'lucide-react';
import type { Analysis, ClarificationDetail } from '../types';

interface Props {
  analysis: Analysis | null;
  onOpenAnalyzer: () => void;
  onApplyClarification: (updatedMessage: string, clarifyingFact?: string) => void;
  onLoadExample?: (index: number) => void;
}

export default function ClarificationCenter({
  analysis,
  onOpenAnalyzer,
  onApplyClarification,
  onLoadExample
}: Props) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  const details = analysis?.clarification_details || [];
  const questions = analysis?.clarifications || [];

  const handleResolveOption = (expression: string, choice: string) => {
    if (!analysis) return;
    setSelectedAnswers((prev) => ({ ...prev, [expression]: choice }));

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

  const handleCustomResolve = (expression: string) => {
    const val = customAnswers[expression]?.trim();
    if (!val) return;
    handleResolveOption(expression, val);
  };

  return (
    <div className="clarification-center-container">
      {/* Header */}
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>UNCERTAINTY TRIAGE & ACTIVE DISAMBIGUATION</span>
        </div>
        <h1>Clarification Center</h1>
        <p>
          Targeted contextual questions for ambiguous references. When discourse evidence is tied or missing, the system asks rather than guessing.
        </p>
      </div>

      {/* Active Clarification Queue */}
      <section className="clarification-queue-section">
        <div className="queue-header-bar">
          <div className="queue-title-group">
            <span className="queue-icon-circle">
              <HelpCircle size={18} />
            </span>
            <div>
              <h3>Active Clarification Prompts</h3>
              <p>
                {analysis ? `Evaluating utterance: “${analysis.original}”` : 'No current analysis active'}
              </p>
            </div>
          </div>
          <span className="queue-count-badge">
            {Math.max(questions.length, details.length)} Pending Prompt{Math.max(questions.length, details.length) === 1 ? '' : 's'}
          </span>
        </div>

        {questions.length > 0 || details.length > 0 ? (
          <div className="queue-cards-list">
            {details.length > 0 ? (
              details.map((item, idx) => (
                <div key={item.id || idx} className="queue-item-card">
                  <div className="q-card-top">
                    <span className="q-target-token">Target: “{item.expression}”</span>
                    <span className="q-type-badge">{item.type}</span>
                  </div>

                  <h4 className="q-title-text">{item.question}</h4>

                  {/* Candidate Options */}
                  {item.options && item.options.length > 0 && (
                    <div className="q-options-container">
                      <span className="q-opt-label">Select verified referent:</span>
                      <div className="q-buttons-wrap">
                        {item.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            className={`q-choice-btn ${selectedAnswers[item.expression] === opt ? 'active' : ''}`}
                            onClick={() => handleResolveOption(item.expression, opt)}
                          >
                            <Sparkles size={11} />
                            <span>{opt}</span>
                            <ArrowRight size={11} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Write-In */}
                  <div className="q-custom-box">
                    <input
                      className="q-custom-input"
                      placeholder={`Specify exact referent for “${item.expression}”…`}
                      value={customAnswers[item.expression] || ''}
                      onChange={(e) =>
                        setCustomAnswers({ ...customAnswers, [item.expression]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCustomResolve(item.expression);
                      }}
                    />
                    <button
                      className="q-submit-btn"
                      onClick={() => handleCustomResolve(item.expression)}
                      disabled={!customAnswers[item.expression]?.trim()}
                    >
                      <Send size={12} /> Resolve & Re-analyze
                    </button>
                  </div>
                </div>
              ))
            ) : (
              questions.map((q, idx) => {
                const targetAmb = analysis?.ambiguities.find(
                  (a) => !a.resolved && q.toLowerCase().includes(a.expression.toLowerCase())
                );
                const expr = targetAmb ? targetAmb.expression : 'it';
                const opts = targetAmb?.candidates || [];

                return (
                  <div key={idx} className="queue-item-card">
                    <h4 className="q-title-text">{q}</h4>
                    {opts.length > 0 && (
                      <div className="q-buttons-wrap">
                        {opts.map((opt, i) => (
                          <button
                            key={i}
                            className="q-choice-btn"
                            onClick={() => handleResolveOption(expr, opt)}
                          >
                            <span>{opt}</span>
                            <ArrowRight size={11} />
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="q-custom-box">
                      <input
                        className="q-custom-input"
                        placeholder="Type explicit clarification…"
                        value={customAnswers[expr] || ''}
                        onChange={(e) =>
                          setCustomAnswers({ ...customAnswers, [expr]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCustomResolve(expr);
                        }}
                      />
                      <button
                        className="q-submit-btn"
                        onClick={() => handleCustomResolve(expr)}
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
        ) : (
          <div className="queue-all-clear">
            <div className="all-clear-icon">
              <CheckCircle2 size={32} />
            </div>
            <h3>No pending clarification prompts</h3>
            <p>
              Either all references have sufficient contextual support, or no message has been analyzed yet.
            </p>
            <div className="all-clear-actions">
              <button className="primary-action-btn" onClick={onOpenAnalyzer}>
                <span>Go to Analyzer</span>
                <ArrowRight size={14} />
              </button>
              {onLoadExample && (
                <button className="secondary-action-btn" onClick={() => onLoadExample(1)}>
                  <Sparkles size={14} />
                  <span>Try “Zero Context” Demo (Generates Clarifications)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Philosophy of Honest Uncertainty */}
      <section className="honest-uncertainty-section">
        <div className="section-head">
          <div className="section-eyebrow">SYSTEM ETHICS</div>
          <h2>Why the System Refuses to Guess</h2>
          <p>
            Standard language models generate hallucinations or plausible-sounding guesses when context is lacking. In high-stakes workplace, legal, medical, or engineering communication, guessing causes catastrophic misunderstandings.
          </p>
        </div>

        <div className="ethics-comparison-grid">
          <div className="ethic-card danger">
            <div className="ethic-top">
              <AlertTriangle size={18} />
              <h4>Naive Chatbot Behavior</h4>
            </div>
            <p className="ethic-quote">User: “Send it to her”</p>
            <p className="ethic-response">
              Chatbot: <em>“I have sent the file to Maya!”</em> (Blind hallucination guessing who ‘her’ and ‘it’ are).
            </p>
            <span className="ethic-result red">Result: Miscommunication & data leakage</span>
          </div>

          <div className="ethic-card safe">
            <div className="ethic-top">
              <ShieldCheck size={18} />
              <h4>Contexta Ambiguity Resolution</h4>
            </div>
            <p className="ethic-quote">User: “Send it to her”</p>
            <p className="ethic-response">
              Contexta: <strong>“What does ‘it’ refer to?”</strong> and <strong>“Who does ‘her’ refer to?”</strong>
            </p>
            <span className="ethic-result green">Result: Guaranteed communicative accuracy</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
