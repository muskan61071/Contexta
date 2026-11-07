import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Layers,
  Brain,
  Waypoints,
  FileText,
  X,
  ShieldAlert,
  Play,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import type { Analysis, ContextMessage } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contextMessages: ContextMessage[];
  message: string;
  result: Analysis | null;
  savedAnalysesCount: number;
  onLoadScenario: (index: number) => void;
  onNavigatePage: (page: string) => void;
}

export default function ProjectGuideModal({
  isOpen,
  onClose,
  contextMessages,
  message,
  result,
  savedAnalysesCount,
  onLoadScenario,
  onNavigatePage
}: Props) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'scenarios' | 'principles' | 'faq'>('workflow');

  if (!isOpen) return null;

  // Real-time progress evaluation
  const step1Done = contextMessages.length > 0;
  const step2Done = message.trim().length > 0;
  const step3Done = Boolean(result);
  const step4Done = Boolean(
    result && (result.confidence >= 65 || (result.ambiguities.length > 0 && result.ambiguities.every((a) => a.resolved)))
  );
  const step5Done = savedAnalysesCount > 0;

  const completedCount = [step1Done, step2Done, step3Done, step4Done, step5Done].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 5) * 100);

  const scenarios = [
    {
      id: 0,
      title: 'Document & Recipient Handoff',
      tag: 'Pronoun + Temporal',
      desc: '“Send it to her after that” in a multi-turn thread about reports, Priya, and team meetings.',
      learning: 'Resolves multiple pronouns simultaneously and binds “after that” to the meeting event.'
    },
    {
      id: 1,
      title: 'Executive Task Delegation',
      tag: 'Syntactic Binding',
      desc: '“Rahul told Arjun that he should submit the report” with context showing Arjun holds the task.',
      learning: 'Eliminates grammatical ambiguity between two competing male names using task-responsibility memory.'
    },
    {
      id: 2,
      title: 'Financial Polysemy',
      tag: 'Lexical Ambiguity',
      desc: '“I will stop by the bank this afternoon” with earlier cheque deposit discussion.',
      learning: 'Differentiates financial institution from riverbank using lexical semantic co-occurrence.'
    },
    {
      id: 3,
      title: 'Instrumental Preposition',
      tag: 'PP Attachment',
      desc: '“I saw the client with the telescope” without clarifying context.',
      learning: 'Surfaces dual syntactic readings and provides 1-click clarification prompts to avoid misunderstanding.'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="project-guide-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="pgm-header">
          <div className="pgm-title-group">
            <div className="pgm-icon-badge">
              <Compass size={22} />
            </div>
            <div>
              <h2>Project Workspace Guide & Workflow Coach</h2>
              <p>Step-by-step guidance to master context-aware ambiguity resolution</p>
            </div>
          </div>
          <button className="pgm-close-btn" onClick={onClose} aria-label="Close guide">
            <X size={20} />
          </button>
        </div>

        {/* Real-time Progress Bar */}
        <div className="pgm-progress-banner">
          <div className="pgm-progress-info">
            <span className="pgm-progress-label">YOUR PROJECT WORKFLOW PROGRESS:</span>
            <strong className="pgm-progress-val">{completedCount} of 5 Steps Completed ({progressPercent}%)</strong>
          </div>
          <div className="pgm-progress-track">
            <div className="pgm-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pgm-tabs-row">
          <button
            className={`pgm-tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            <CheckCircle2 size={15} />
            <span>Interactive Checklist</span>
          </button>
          <button
            className={`pgm-tab-btn ${activeTab === 'scenarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            <Sparkles size={15} />
            <span>Test Scenarios (1-Click Run)</span>
          </button>
          <button
            className={`pgm-tab-btn ${activeTab === 'principles' ? 'active' : ''}`}
            onClick={() => setActiveTab('principles')}
          >
            <Brain size={15} />
            <span>NLP & Discourse Concepts</span>
          </button>
          <button
            className={`pgm-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <HelpCircle size={15} />
            <span>Troubleshooting & Tips</span>
          </button>
        </div>

        {/* Tab 1: Interactive Workflow Checklist */}
        {activeTab === 'workflow' && (
          <div className="pgm-content-body">
            <div className="pgm-checklist">
              {/* Step 1 */}
              <div className={`pgm-check-card ${step1Done ? 'done' : 'pending'}`}>
                <div className="pgm-check-status">
                  {step1Done ? <CheckCircle2 size={20} className="check-green" /> : <Circle size={20} />}
                </div>
                <div className="pgm-check-detail">
                  <div className="pgm-step-kicker">STEP 01</div>
                  <h4>Establish Conversation Context</h4>
                  <p>
                    Pronouns like <em>“it”</em>, <em>“her”</em>, and <em>“that”</em> are anaphoric references: they depend entirely on previous messages.
                    Add at least one or two context messages in the left panel to introduce entities (e.g. Maya, Leo, project report).
                  </p>
                  <div className="pgm-action-line">
                    <span className="pgm-state-badge">
                      {step1Done ? `✓ ${contextMessages.length} turn(s) active` : '○ Awaiting context messages'}
                    </span>
                    {!step1Done && (
                      <button
                        className="pgm-inline-btn"
                        onClick={() => {
                          onLoadScenario(0);
                          onClose();
                        }}
                      >
                        <Play size={12} /> Load Sample Context
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`pgm-check-card ${step2Done ? 'done' : 'pending'}`}>
                <div className="pgm-check-status">
                  {step2Done ? <CheckCircle2 size={20} className="check-green" /> : <Circle size={20} />}
                </div>
                <div className="pgm-check-detail">
                  <div className="pgm-step-kicker">STEP 02</div>
                  <h4>Draft or Paste Target Message</h4>
                  <p>
                    Enter the utterance you want to verify or send. Live preview evaluates changes as you pause typing.
                    Include pronouns, temporal markers (<em>“after that”</em>), or polysemous terms to test the system.
                  </p>
                  <div className="pgm-action-line">
                    <span className="pgm-state-badge">
                      {step2Done ? `✓ “${message.slice(0, 35)}${message.length > 35 ? '…' : ''}”` : '○ Message box empty'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`pgm-check-card ${step3Done ? 'done' : 'pending'}`}>
                <div className="pgm-check-status">
                  {step3Done ? <CheckCircle2 size={20} className="check-green" /> : <Circle size={20} />}
                </div>
                <div className="pgm-check-detail">
                  <div className="pgm-step-kicker">STEP 03</div>
                  <h4>Review Ambiguity Badges & Confidence Evidence</h4>
                  <p>
                    Contexta extracts semantic roles (Agent, Action, Recipient, Object) and scores antecedent candidates based on mention recency and linguistic overlap.
                    Examine the confidence score ({result?.confidence || '--'}%) and miscommunication risk level ({result?.risk || '--'}).
                  </p>
                  <div className="pgm-action-line">
                    <span className="pgm-state-badge">
                      {step3Done ? `✓ ${result?.ambiguities.length || 0} ambiguity item(s) scanned` : '○ Awaiting analysis'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`pgm-check-card ${step4Done ? 'done' : 'pending'}`}>
                <div className="pgm-check-status">
                  {step4Done ? <CheckCircle2 size={20} className="check-green" /> : <Circle size={20} />}
                </div>
                <div className="pgm-check-detail">
                  <div className="pgm-step-kicker">STEP 04</div>
                  <h4>Resolve via Clarification or Accept Suggested Rewrite</h4>
                  <p>
                    If confidence is high, Contexta creates a <strong>Make It Clear</strong> rewrite that substitutes ambiguous words with explicit entities.
                    If confidence is low, select an option from the <strong>Clarification Assistant</strong> to resolve ambiguity in 1 click.
                  </p>
                  <div className="pgm-action-line">
                    <span className="pgm-state-badge">
                      {step4Done ? '✓ Clear resolution confirmed' : '○ Pending disambiguation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className={`pgm-check-card ${step5Done ? 'done' : 'pending'}`}>
                <div className="pgm-check-status">
                  {step5Done ? <CheckCircle2 size={20} className="check-green" /> : <Circle size={20} />}
                </div>
                <div className="pgm-check-detail">
                  <div className="pgm-step-kicker">STEP 05</div>
                  <h4>Save to Local History & Inspect Project Dashboard</h4>
                  <p>
                    Click <strong>Analyze Message</strong> (or ⌘/Ctrl+Enter) to persist the analysis to local SQLite storage.
                    Then navigate to <strong>Analysis History</strong> or <strong>Dashboard</strong> to track miscommunication patterns across your workspace.
                  </p>
                  <div className="pgm-action-line">
                    <span className="pgm-state-badge">
                      {step5Done ? `✓ ${savedAnalysesCount} record(s) in local SQLite history` : '○ No saved analyses yet'}
                    </span>
                    {step5Done && (
                      <button
                        className="pgm-inline-btn"
                        onClick={() => {
                          onNavigatePage('Dashboard');
                          onClose();
                        }}
                      >
                        View Dashboard Metrics <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Test Scenarios */}
        {activeTab === 'scenarios' && (
          <div className="pgm-content-body">
            <div className="pgm-scenarios-grid">
              {scenarios.map((sc) => (
                <div key={sc.id} className="pgm-scenario-card">
                  <div className="pgm-sc-top">
                    <span className="pgm-sc-tag">{sc.tag}</span>
                    <button
                      className="pgm-sc-launch-btn"
                      onClick={() => {
                        onLoadScenario(sc.id);
                        onClose();
                      }}
                    >
                      <Play size={12} /> Launch Scenario
                    </button>
                  </div>
                  <h4>{sc.title}</h4>
                  <p className="pgm-sc-desc">{sc.desc}</p>
                  <div className="pgm-sc-learning">
                    <Lightbulb size={13} />
                    <span>{sc.learning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: NLP & Discourse Concepts */}
        {activeTab === 'principles' && (
          <div className="pgm-content-body">
            <div className="pgm-principles-list">
              <div className="pgm-principle-item">
                <div className="pgm-pi-icon purple">
                  <Layers size={18} />
                </div>
                <div>
                  <h4>1. Pronoun Antecedent Binding</h4>
                  <p>
                    A pronoun (<em>he</em>, <em>she</em>, <em>it</em>, <em>they</em>) is an empty vessel. It points back to an antecedent noun phrase in recent discourse.
                    Contexta extracts candidate people and objects from prior turns and ranks them by recency, grammatical role, and semantic compatibility.
                  </p>
                </div>
              </div>

              <div className="pgm-principle-item">
                <div className="pgm-pi-icon blue">
                  <Waypoints size={18} />
                </div>
                <div>
                  <h4>2. Semantic Role Labeling</h4>
                  <p>
                    Sentences describe events with actors. In <em>“Rahul sent Priya the report”</em>:
                    <br />
                    • <strong>Agent</strong>: Rahul (sender)
                    <br />
                    • <strong>Recipient</strong>: Priya (receiver)
                    <br />
                    • <strong>Object</strong>: The report (theme)
                    <br />
                    When the next message says <em>“Send it to her”</em>, the engine matches <em>“her”</em> to the previous <strong>Recipient</strong> (Priya).
                  </p>
                </div>
              </div>

              <div className="pgm-principle-item">
                <div className="pgm-pi-icon emerald">
                  <Brain size={18} />
                </div>
                <div>
                  <h4>3. Evidence-Weighted Confidence</h4>
                  <p>
                    Rather than hallucinating answers, Contexta only declares a reference resolved when the evidence lead is decisive.
                    If multiple candidates are equally plausible (e.g. <em>“Rahul told Arjun that he should submit”</em> without context), the system keeps uncertainty visible and surfaces clarification options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Troubleshooting & Tips */}
        {activeTab === 'faq' && (
          <div className="pgm-content-body">
            <div className="pgm-faq-list">
              <div className="pgm-faq-item">
                <b>Q: Why is my confidence score low (under 50%)?</b>
                <p>
                  A low confidence score indicates that either (1) no conversation context was supplied to resolve pronouns, or (2) multiple entities in the conversation could equally be the intended referent.
                  Add explicit context messages or click the Clarification question to lock in your intended meaning.
                </p>
              </div>

              <div className="pgm-faq-item">
                <b>Q: What is the difference between Live Preview and Analyze Message?</b>
                <p>
                  <strong>Live Preview</strong> runs automatically with a 700ms debounce while you type so you see instant feedback. Live preview is ephemeral and not saved to SQLite.
                  Clicking <strong>Analyze Message</strong> (or Ctrl+Enter) saves the analysis permanently into your project history database for dashboard metrics and tracking.
                </p>
              </div>

              <div className="pgm-faq-item">
                <b>Q: Is my conversation data sent to remote servers?</b>
                <p>
                  No. Contexta runs 100% locally. The NLP engine runs on your local Python FastAPI instance (`http://localhost:8000`), the gateway on Express (`http://localhost:5000`), and history is stored in your local SQLite database (`contexta.sqlite3`).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pgm-footer">
          <div className="pgm-footer-left">
            <span>Tip: You can reopen this guide anytime using the <strong>Workflow Guide</strong> button in the topbar.</span>
          </div>
          <button className="pgm-done-btn" onClick={onClose}>
            Back to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
