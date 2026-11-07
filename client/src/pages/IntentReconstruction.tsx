import React from 'react';
import {
  Brain,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import type { Analysis } from '../types';

interface Props {
  analysis: Analysis | null;
  onOpenAnalyzer: () => void;
  onLoadExample?: (index: number) => void;
}

export default function IntentReconstruction({ analysis, onOpenAnalyzer, onLoadExample }: Props) {
  if (!analysis) {
    return (
      <div className="intent-page-container">
        <div className="page-header-standard">
          <div className="page-eyebrow">
            <span className="eyebrow-line" />
            <span>DISCOURSE ANALYSIS ENGINE</span>
          </div>
          <h1>Intent Reconstruction</h1>
          <p>
            Transforms context-dependent messages into explicit representations of what the speaker intended, backed by conversation evidence.
          </p>
        </div>

        <div className="intent-empty-guide">
          <div className="intent-empty-hero">
            <div className="empty-hero-icon">
              <Brain size={32} />
            </div>
            <h2>No active analysis to reconstruct</h2>
            <p>
              Analyze a message in the workspace, or inspect this canonical transformation trace below:
            </p>
            <button className="primary-action-btn" onClick={onOpenAnalyzer}>
              <span>Open Analyzer Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Educational Visual Transformation Trace */}
          <div className="transformation-sample-card">
            <div className="sample-card-head">
              <span className="sample-tag">CANONICAL WORKFLOW DEMO</span>
              <b>From Context to Explicit Communication</b>
            </div>

            <div className="sample-context-quote">
              <span className="ctx-label">Conversation Context:</span>
              <p>“The project report is ready.” · “Priya needs the report.” · “The meeting is at 3 PM.”</p>
            </div>

            <div className="sample-flow-grid">
              <div className="flow-step-box raw">
                <span className="step-kicker">STEP 1: RAW UTTERANCE</span>
                <p>“Send <strong>it</strong> to <strong>her</strong> after <strong>that</strong>”</p>
                <small>3 ambiguous context-dependent references</small>
              </div>

              <div className="flow-arrow">
                <ArrowRight size={20} />
              </div>

              <div className="flow-step-box resolved">
                <span className="step-kicker">STEP 2: EVIDENCE RESOLUTION</span>
                <div className="subst-mini-list">
                  <span><code>it</code> → the project report (Object)</span>
                  <span><code>her</code> → Priya (Recipient)</span>
                  <span><code>that</code> → the meeting (Event)</span>
                </div>
              </div>

              <div className="flow-arrow">
                <ArrowRight size={20} />
              </div>

              <div className="flow-step-box reconstructed">
                <span className="step-kicker">STEP 3: RECONSTRUCTED INTENT</span>
                <p>“Send <strong>the project report</strong> to <strong>Priya</strong> after <strong>the meeting</strong>”</p>
                <small className="green-tag">100% unambiguous</small>
              </div>
            </div>

            {onLoadExample && (
              <button className="sample-load-action" onClick={() => onLoadExample(0)}>
                <Sparkles size={14} />
                <span>Load this scenario in Analyzer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isDecisive = Boolean(analysis.intent);
  const replacements = analysis.replacement_map || 
    analysis.ambiguities
      .filter((a) => a.resolved)
      .map((a) => ({
        original: a.expression,
        resolved: a.resolved!,
        reason: a.reason
      }));

  return (
    <div className="intent-page-container">
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>LINGUISTIC DISAMBIGUATION & INTENT RECONSTRUCTION</span>
        </div>
        <h1>Intent Reconstruction Breakdown</h1>
        <p>
          Examining how discourse antecedents, thematic roles, and lexical overlaps yield the most strongly supported reading.
        </p>
      </div>

      {/* Primary Reconstructed Intent Highlight Banner */}
      <div className={`intent-detail-banner ${isDecisive ? 'decisive' : 'undecided'}`}>
        <div className="banner-badge-row">
          <span className="banner-type-pill">
            {isDecisive ? (
              <>
                <ShieldCheck size={14} />
                <span>RECONSTRUCTED INTENDED MEANING</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} />
                <span>MULTIPLE COMPETING INTENTS (UNCERTAINTY VISIBLE)</span>
              </>
            )}
          </span>
          <span className="banner-conf-pill">{analysis.confidence}% Evidence Strength ({analysis.confidence_level})</span>
        </div>

        <h2 className="banner-main-quote">
          {isDecisive
            ? `“${analysis.intent}”`
            : 'Available context does not decisively support a single candidate without guessing.'}
        </h2>

        <div className="banner-original-ref">
          <span>Based on user utterance:</span>
          <code>“{analysis.original}”</code>
        </div>
      </div>

      {/* Side-by-Side Comparison & Token Mapping Table */}
      <div className="intent-breakdown-grid">
        {/* Token Mapping Matrix */}
        <div className="intent-panel-box">
          <div className="panel-box-title">
            <Sparkles size={16} />
            <h3>Contextual Token Substitution Map</h3>
          </div>
          <p className="panel-box-sub">
            How ambiguous surface expressions were mapped to explicit discourse entities:
          </p>

          {replacements.length > 0 ? (
            <div className="token-map-table-wrap">
              <table className="token-map-table">
                <thead>
                  <tr>
                    <th>Ambiguous Token</th>
                    <th>Resolved Entity</th>
                    <th>Rationale & Thematic Role</th>
                  </tr>
                </thead>
                <tbody>
                  {replacements.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <code className="token-code">“{r.original}”</code>
                      </td>
                      <td>
                        <strong className="token-resolved">{r.resolved}</strong>
                      </td>
                      <td className="token-reason">{r.reason || 'Contextual recency & role alignment'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-substitutions-notice">
              <AlertTriangle size={15} />
              <span>No references could be safely resolved from the available context.</span>
            </div>
          )}
        </div>

        {/* Ranked Alternative Readings */}
        <div className="intent-panel-box">
          <div className="panel-box-title">
            <Layers size={16} />
            <h3>Ranked Alternative Interpretations ({analysis.interpretations.length})</h3>
          </div>
          <p className="panel-box-sub">
            All possible candidate meanings evaluated against available discourse evidence:
          </p>

          <div className="intent-alts-stack">
            {analysis.interpretations.map((interp, idx) => (
              <div key={idx} className={`intent-alt-row ${idx === 0 && isDecisive ? 'winner' : ''}`}>
                <div className="alt-row-top">
                  <span className="alt-rank">Rank #{idx + 1}</span>
                  <b className="alt-meaning">“{interp.meaning}”</b>
                  <span className="alt-pct">{interp.confidence}%</span>
                </div>

                <div className="alt-row-bar">
                  <div className="alt-bar-fill" style={{ width: `${interp.confidence}%` }} />
                </div>

                {interp.support && interp.support.length > 0 && (
                  <div className="alt-support-quotes">
                    <span>Supporting:</span>
                    {interp.support.map((s, sIdx) => (
                      <span key={sIdx} className="support-tag">“{s}”</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Clear Utterance Card */}
      {analysis.rewrite && (
        <div className="intent-rewrite-banner">
          <div className="ir-top">
            <FileText size={18} />
            <div>
              <h4>Recommended Clear Communication</h4>
              <p>Send this version to eliminate ambiguity:</p>
            </div>
          </div>
          <p className="ir-text">“{analysis.rewrite}”</p>
        </div>
      )}
    </div>
  );
}
