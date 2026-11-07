import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  Clock,
  Layers,
  MessageSquareQuote,
  Users,
  CheckCircle2,
  Tag,
  Send,
  AlertCircle
} from 'lucide-react';
import type { Analysis, ContextMessage } from '../types';
import { parseConversation, getSpeakerColor } from '../utils/conversationParser';
import { demoConversations, type DemoConversation } from '../data/demoConversations';
import ConfidenceIndicator from '../components/analysis/ConfidenceIndicator';
import RiskIndicator from '../components/analysis/RiskIndicator';

interface Props {
  result: Analysis | null;
  busy: boolean;
  error: string;
  onRunAnalysis: (msg: string, ctx: ContextMessage[]) => Promise<void> | void;
  onClearWorkspace: () => void;
  initialText?: string;
  initialContext?: ContextMessage[];
}

export default function ConversationAnalyzer({
  result,
  busy,
  error,
  onRunAnalysis,
  onClearWorkspace,
  initialText = '',
  initialContext = []
}: Props) {
  // Single main text box state for conversation
  const [conversationText, setConversationText] = useState<string>(initialText);
  // Parsed message list displayed in chat-bubble style
  const [messages, setMessages] = useState<ContextMessage[]>([]);
  // ID of the target message currently being analyzed
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  // Active demo example ID
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  // Copy state for the main conversation text
  const [copiedExample, setCopiedExample] = useState(false);
  // Copy state for the clearer message rewrite
  const [copiedRewrite, setCopiedRewrite] = useState(false);
  // Custom answers for clarification questions
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  // Sync initial text and context if provided from history or props
  useEffect(() => {
    if (initialText && !conversationText) {
      setConversationText(initialText);
      const parsed = parseConversation(initialText);
      setMessages(parsed);
      if (parsed.length > 0) {
        setSelectedTargetId(parsed[parsed.length - 1].id);
      }
    } else if (initialContext.length > 0 && messages.length === 0) {
      setMessages(initialContext);
      if (!selectedTargetId && initialContext.length > 0) {
        setSelectedTargetId(initialContext[initialContext.length - 1].id);
      }
    }
  }, [initialText, initialContext]);

  // Unique speakers detected in conversation
  const uniqueSpeakers = useMemo(() => {
    const list: string[] = [];
    messages.forEach((m) => {
      if (m.speaker && !list.includes(m.speaker)) {
        list.push(m.speaker);
      }
    });
    return list;
  }, [messages]);

  // Handle selecting a demo example
  const handleSelectDemo = (demo: DemoConversation) => {
    setSelectedDemoId(demo.id);
    setConversationText(demo.fullConversation);

    // Automatically parse into messages so the user can immediately view chat bubbles or edit
    const parsed = parseConversation(demo.fullConversation);
    setMessages(parsed);
    if (parsed.length > 0) {
      setSelectedTargetId(parsed[parsed.length - 1].id);
    }
  };

  // Handle parsing and analyzing conversation
  const handleAnalyze = async (overrideTargetId?: string) => {
    const textToParse = conversationText.trim();
    if (!textToParse) {
      return;
    }

    const parsed = parseConversation(textToParse);
    if (parsed.length === 0) {
      return;
    }

    setMessages(parsed);

    // Determine which message to analyze
    const targetId = overrideTargetId || selectedTargetId || parsed[parsed.length - 1].id;
    setSelectedTargetId(targetId);

    const targetIndex = parsed.findIndex((m) => m.id === targetId);
    const targetMsg = targetIndex !== -1 ? parsed[targetIndex] : parsed[parsed.length - 1];

    // Messages prior to the target message act as conversation context
    const contextTurns = targetIndex > 0 ? parsed.slice(0, targetIndex) : [];

    await onRunAnalysis(targetMsg.text, contextTurns);
  };

  // Switch target message to any selected bubble
  const handleSelectMessageAsTarget = (msgId: string) => {
    setSelectedTargetId(msgId);
    handleAnalyze(msgId);
  };

  // Clear workspace
  const handleClear = () => {
    setConversationText('');
    setMessages([]);
    setSelectedTargetId(null);
    setSelectedDemoId(null);
    setCustomAnswers({});
    onClearWorkspace();
  };

  // Copy conversation text to clipboard
  const handleCopyExample = async (textToCopy?: string) => {
    const content = textToCopy || conversationText;
    if (!content.trim()) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Copy clearer message rewrite
  const handleCopyClearMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRewrite(true);
      setTimeout(() => setCopiedRewrite(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Answer a clarification question to resolve an ambiguity
  const handleApplyClarification = (expression: string, selectedMeaning: string) => {
    if (!result) return;
    const targetIndex = messages.findIndex((m) => m.id === selectedTargetId);
    const targetMsg = targetIndex !== -1 ? messages[targetIndex] : messages[messages.length - 1];
    if (!targetMsg) return;

    // Replace the ambiguous expression with the clarification choice in the target message
    const regex = new RegExp(`\\b${expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    let updatedTarget = targetMsg.text;
    if (regex.test(updatedTarget)) {
      updatedTarget = updatedTarget.replace(regex, selectedMeaning);
    } else {
      updatedTarget = `${targetMsg.text} (${expression} = ${selectedMeaning})`;
    }

    // Add a clarification fact to conversation context
    const clarifyingFact: ContextMessage = {
      id: `clarify-${Date.now()}`,
      speaker: 'Clarification',
      text: `${selectedMeaning} is the intended meaning for “${expression}”.`,
      timestamp: 'Added fact'
    };

    const priorContext = targetIndex > 0 ? messages.slice(0, targetIndex) : [];
    const updatedContext = [...priorContext, clarifyingFact];

    onRunAnalysis(updatedTarget, updatedContext);
  };

  const activeDemo = demoConversations.find((d) => d.id === selectedDemoId);
  const targetMessage = messages.find((m) => m.id === selectedTargetId) || (messages.length > 0 ? messages[messages.length - 1] : null);

  return (
    <div className="conv-analyzer-page">
      {/* Page Header */}
      <div className="page-header-standard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-line" />
            <span>COMMUNICATION INTELLIGENCE</span>
          </div>
          <h1>Conversation Analyzer</h1>
          <p>
            Paste or select a conversation. Contexta parses dialogue turns, identifies ambiguous references, and evaluates contextual evidence in real time.
          </p>
        </div>

        {(conversationText.trim() || messages.length > 0 || result) && (
          <button className="workspace-reset-btn" onClick={handleClear} title="Clear conversation workspace">
            <RotateCcw size={14} />
            <span>New Analysis</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Responsive Workspace: Demo Examples Sidebar (Left) + Workspace (Right) */}
      <div className="conv-workspace-layout">
        {/* LEFT SIDEBAR: Curated Demo Examples */}
        <aside className="conv-demo-sidebar">
          <div className="demo-sidebar-head">
            <div className="demo-head-title">
              <div className="demo-icon-badge">
                <Sparkles size={16} />
              </div>
              <div>
                <h3>Demo Examples</h3>
                <p>Select an example to load it into the main input box:</p>
              </div>
            </div>
          </div>

          <div className="demo-examples-list">
            {demoConversations.map((demo) => {
              const isSelected = selectedDemoId === demo.id;
              return (
                <div
                  key={demo.id}
                  className={`demo-card-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectDemo(demo)}
                  title={`Click to load ${demo.title}`}
                >
                  <div className="demo-card-top">
                    <span className={`demo-category-tag tag-${demo.shortTag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {demo.shortTag}
                    </span>
                    {isSelected && (
                      <span className="active-indicator-tag">
                        <Check size={11} />
                        Active
                      </span>
                    )}
                  </div>

                  <h4 className="demo-card-title">{demo.title}</h4>
                  <p className="demo-card-desc">{demo.description}</p>

                  <div className="demo-card-footer">
                    <span className="demo-highlight-badge">{demo.highlightNote}</span>
                    <button
                      className="demo-card-copy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDemo(demo);
                        handleCopyExample(demo.fullConversation);
                      }}
                      title="Copy example text"
                    >
                      <Copy size={11} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT MAIN COLUMN: Single Main Input Box, Chat Stream, and NLP Results */}
        <main className="conv-main-column">
          {/* SINGLE MAIN TEXT BOX */}
          <section className="conv-input-card">
            <div className="conv-input-header">
              <div className="conv-input-title-row">
                <div className="conv-step-badge">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3>Conversation Input</h3>
                  <p>
                    {activeDemo
                      ? `Loaded example: “${activeDemo.title}”. You can read, edit, copy, or analyze it below.`
                      : 'Paste your complete chat transcript below or select a demo example from the left sidebar.'}
                  </p>
                </div>
              </div>
              {uniqueSpeakers.length > 0 && (
                <div className="participants-badge">
                  <Users size={12} />
                  <span>{uniqueSpeakers.length} speaker{uniqueSpeakers.length === 1 ? '' : 's'}</span>
                </div>
              )}
            </div>

            <div className="conv-textarea-wrap">
              <textarea
                className="conv-main-textarea"
                value={conversationText}
                onChange={(e) => {
                  setConversationText(e.target.value);
                  setSelectedDemoId(null);
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    handleAnalyze();
                  }
                }}
                placeholder={`Paste a conversation with messages from different people, preferably including their names. For example:

Alex: The project report is ready.
Jordan: Sarah needs the report before 4 PM.
Alex: I will send it to her after the review meeting.`}
                rows={6}
                maxLength={5000}
              />

              <div className="conv-textarea-footer">
                <div className="conv-footer-hint">
                  <span>Tip: Format lines as <code>Speaker: Message</code> or just text.</span>
                </div>
                <div className="conv-char-count">
                  {conversationText.length} / 5,000 characters
                </div>
              </div>
            </div>

            <div className="conv-actions-bar">
              {/* Primary Analyze Conversation Button */}
              <button
                className="conv-analyze-submit-btn"
                onClick={() => handleAnalyze()}
                disabled={busy || !conversationText.trim()}
              >
                {busy ? (
                  <>
                    <span className="spinner" />
                    <span>Analyzing conversation…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Analyze Conversation</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Copy Example / Copy Conversation Button */}
              <button
                className={`conv-copy-action-btn ${copiedExample ? 'copied' : ''}`}
                onClick={() => handleCopyExample()}
                disabled={!conversationText.trim()}
                title="Copy current conversation to clipboard"
              >
                {copiedExample ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedExample ? 'Copied Example!' : 'Copy Example'}</span>
              </button>

              {/* Clear Workspace Button */}
              {conversationText.trim() && (
                <button className="conv-clear-btn" onClick={handleClear} title="Clear text">
                  Clear
                </button>
              )}
            </div>

            {error && (
              <div className="composer-error-box" style={{ marginTop: '14px' }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}
          </section>

          {/* CHAT-STYLE CONVERSATION VIEW */}
          {messages.length > 0 && (
            <section className="conv-chat-section">
              <div className="conv-chat-header">
                <div className="chat-title-group">
                  <Users size={16} />
                  <h3>Conversation Messages</h3>
                  <span className="chat-count-pill">{messages.length} message{messages.length === 1 ? '' : 's'}</span>
                </div>

                <div className="chat-participants-row">
                  {uniqueSpeakers.map((speaker) => {
                    const color = getSpeakerColor(speaker, uniqueSpeakers);
                    return (
                      <span key={speaker} className="speaker-pill" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <span className="speaker-dot" style={{ background: color }} />
                        <strong>{speaker}</strong>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="conv-chat-stream">
                {messages.map((msg, idx) => {
                  const isTarget = msg.id === selectedTargetId || (!selectedTargetId && idx === messages.length - 1);
                  const color = getSpeakerColor(msg.speaker, uniqueSpeakers);
                  const initial = (msg.speaker || 'U').charAt(0).toUpperCase();

                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${isTarget ? 'target-row' : ''}`}
                    >
                      <div className="chat-avatar" style={{ background: color }}>
                        {initial}
                      </div>

                      <div className={`chat-bubble-card ${isTarget ? 'is-target' : ''}`}>
                        <div className="chat-bubble-top">
                          <strong className="chat-speaker-name" style={{ color: '#f1f5f9' }}>
                            {msg.speaker}
                          </strong>
                          <div className="chat-meta-tags">
                            <span className="chat-time-tag">
                              <Clock size={10} />
                              {msg.timestamp || `Turn ${idx + 1}`}
                            </span>
                            {isTarget && (
                              <span className="chat-target-indicator">
                                <Sparkles size={10} />
                                Analyzed Target
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="chat-message-text">{msg.text}</p>

                        {!isTarget && (
                          <div className="chat-bubble-actions">
                            <button
                              className="chat-select-target-btn"
                              onClick={() => handleSelectMessageAsTarget(msg.id)}
                              title="Analyze this message with preceding conversation as context"
                            >
                              <Sparkles size={11} />
                              <span>Analyze this message</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* NLP ANALYSIS RESULTS VIEW */}
          {result && (
            <section className="conv-results-section">
              <div className="results-section-header">
                <div className="results-header-title">
                  <div className="results-badge-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h2>NLP Analysis & Clarity Breakdown</h2>
                    <p>
                      Evaluated target message <em>“{targetMessage?.text || result.original}”</em> using conversation context.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Miscommunication Risk & Evidence Confidence Banner */}
              <div className="results-overview-bar">
                <RiskIndicator
                  risk={result.risk}
                  reasons={result.risk_reasons}
                  riskScore={result.risk_score}
                />
                <ConfidenceIndicator
                  value={result.confidence}
                  label={result.confidence_level}
                />
              </div>

              {/* 2. Clearer Version of the Message (Rewrite) */}
              <div className="results-block rewrite-block">
                <div className="results-block-head">
                  <div className="results-head-left">
                    <div className="results-block-icon emerald">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3>Clearer Version of Message</h3>
                      <p>Evidence-supported rewrite resolving ambiguous words using conversation context.</p>
                    </div>
                  </div>
                  {result.rewrite && (
                    <button
                      className={`copy-rewrite-btn ${copiedRewrite ? 'copied' : ''}`}
                      onClick={() => handleCopyClearMessage(result.rewrite!)}
                    >
                      {copiedRewrite ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedRewrite ? 'Copied to Clipboard!' : 'Copy Clear Message'}</span>
                    </button>
                  )}
                </div>

                {result.rewrite ? (
                  <div className="rewrite-content-box">
                    <div className="rewrite-comparison-grid">
                      <div className="rewrite-pane original-pane">
                        <span className="pane-label">ORIGINAL MESSAGE</span>
                        <p className="pane-text">“{result.original}”</p>
                      </div>

                      <div className="rewrite-arrow-sep">
                        <ArrowRight size={18} />
                      </div>

                      <div className="rewrite-pane clear-pane">
                        <span className="pane-label green">SUGGESTED CLEAR REWRITE</span>
                        <p className="pane-text green">“{result.rewrite}”</p>
                      </div>
                    </div>

                    {/* Specific Resolved Replacements */}
                    {result.replacement_map && result.replacement_map.length > 0 && (
                      <div className="rewrite-replacements-row">
                        <span className="replacements-title">Resolved terms:</span>
                        <div className="replacement-chips">
                          {result.replacement_map.map((item, idx) => (
                            <div key={idx} className="replacement-chip">
                              <code className="orig-word">“{item.original}”</code>
                              <ArrowRight size={11} />
                              <strong className="resolved-word">{item.resolved}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rewrite-pending-notice">
                    <AlertTriangle size={16} />
                    <div>
                      <b>Clarification required before confirming rewrite</b>
                      <p>
                        {result.ambiguities.length > 0
                          ? 'The conversation context does not provide sufficient evidence to resolve all references safely without guessing.'
                          : 'The original message is already direct and clear!'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Ambiguous Words & References (Resolved Meanings & Possible Interpretations) */}
              <div className="results-block ambiguity-block">
                <div className="results-block-head">
                  <div className="results-head-left">
                    <div className="results-block-icon indigo">
                      <Tag size={16} />
                    </div>
                    <div>
                      <h3>Ambiguous Words & References</h3>
                      <p>Specific expressions detected and their contextual resolution.</p>
                    </div>
                  </div>
                  <span className="ambiguity-count-tag">
                    {result.ambiguities.length} item{result.ambiguities.length === 1 ? '' : 's'} detected
                  </span>
                </div>

                {result.ambiguities.length > 0 ? (
                  <div className="ambiguity-items-list">
                    {result.ambiguities.map((item, idx) => {
                      const hasEvidence = Boolean(item.has_enough_evidence ?? item.resolved);
                      const candidates = item.possible_meanings && item.possible_meanings.length > 0
                        ? item.possible_meanings
                        : item.candidates || [];

                      return (
                        <div key={`${item.expression}-${idx}`} className="amb-item-card">
                          <div className="amb-item-top">
                            <div className="amb-expr-badge-group">
                              <span className="amb-expr-label">Ambiguous word:</span>
                              <code className="amb-expr-code">“{item.expression}”</code>
                              <span className="amb-kind-tag">{item.kind || item.type}</span>
                            </div>

                            <div className="amb-item-status">
                              {hasEvidence ? (
                                <span className="status-badge resolved">
                                  <ShieldCheck size={13} />
                                  <span>Resolved from context</span>
                                </span>
                              ) : (
                                <span className="status-badge unresolved">
                                  <AlertCircle size={13} />
                                  <span>Requires clarification</span>
                                </span>
                              )}
                              <span className="match-confidence-badge">{item.confidence}% Match</span>
                            </div>
                          </div>

                          <p className="amb-reason-paragraph">{item.reason}</p>

                          {/* Resolved Meaning Display */}
                          {item.resolved && (
                            <div className="amb-resolved-meaning-row">
                              <span className="resolved-label">Resolved Meaning:</span>
                              <strong className="resolved-value">
                                <CheckCircle2 size={13} color="#10b981" />
                                {item.resolved}
                              </strong>
                            </div>
                          )}

                          {/* Possible Interpretations / Candidates considered */}
                          {candidates.length > 0 && (
                            <div className="amb-candidates-row">
                              <span className="candidates-label">Possible interpretations:</span>
                              <div className="candidate-pills">
                                {candidates.map((cand, cIdx) => {
                                  const isWinner = item.resolved && cand.toLowerCase().includes(item.resolved.toLowerCase());
                                  return (
                                    <span key={cIdx} className={`candidate-pill ${isWinner ? 'winner' : ''}`}>
                                      {isWinner && <Check size={11} />}
                                      <span>{cand}</span>
                                      {isWinner && <span className="winner-badge">Supported</span>}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Supporting Context Quote */}
                          {item.evidence_message && (
                            <div className="amb-evidence-quote-row">
                              <span className="evidence-label">Context evidence:</span>
                              <div className="evidence-quote-chip">
                                <MessageSquareQuote size={12} color="#10b981" />
                                <span>“{item.evidence_message}”</span>
                              </div>
                            </div>
                          )}

                          {/* Clarification question if unresolved */}
                          {!hasEvidence && item.clarification_question && (
                            <div className="amb-clarification-prompt-box">
                              <HelpCircle size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                              <div>
                                <span className="clarify-prompt-title">Question to ask:</span>
                                <span className="clarify-prompt-text">{item.clarification_question}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ambiguity-empty-card">
                    <CheckCircle2 size={18} color="#10b981" />
                    <span>No ambiguous expressions or unclear references detected. The message is completely clear!</span>
                  </div>
                )}
              </div>

              {/* 4. Context Understanding & Evidence Quotes */}
              <div className="results-block context-block">
                <div className="results-block-head">
                  <div className="results-head-left">
                    <div className="results-block-icon cyan">
                      <MessageSquareQuote size={16} />
                    </div>
                    <div>
                      <h3>Context Understanding</h3>
                      <p>Earlier conversation messages used by Contexta to resolve meanings.</p>
                    </div>
                  </div>
                </div>

                {result.context_used && result.context_used.length > 0 ? (
                  <div className="context-quotes-list">
                    {result.context_used.map((item, idx) => (
                  <div key={idx} className="context-quote-card">
                    <div className="context-quote-top">
                      <MessageSquareQuote size={15} color="#38bdf8" />
                      <p className="context-quote-body">“{item.text}”</p>
                    </div>
                    <div className="context-quote-reason">
                      <CheckCircle2 size={12} color="#10b981" />
                      <span><strong>Relevance:</strong> {item.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="context-empty-card">
                <MessageSquare size={16} />
                <span>No earlier messages directly provided evidence for this message.</span>
              </div>
            )}
          </div>

          {/* 5. Clarification Question (When Context is Insufficient) */}
          {(result.clarifications.length > 0 || (result.clarification_details && result.clarification_details.length > 0)) && (
            <div className="results-block clarification-block">
              <div className="results-block-head">
                <div className="results-head-left">
                  <div className="results-block-icon amber">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <h3>Clarification Questions</h3>
                    <p>Context is insufficient to safely determine intent. Select or type an answer to resolve ambiguity:</p>
                  </div>
                </div>
              </div>

              <div className="clarification-items-container">
                {result.clarification_details && result.clarification_details.length > 0 ? (
                  result.clarification_details.map((detail, idx) => (
                    <div key={detail.id || idx} className="clarification-interactive-card">
                      <div className="clarify-card-head">
                        <span className="clarify-target-word">Target: “{detail.expression}”</span>
                        <span className="clarify-type-tag">{detail.type}</span>
                      </div>

                      <h4 className="clarify-question-title">{detail.question}</h4>

                      {detail.options && detail.options.length > 0 && (
                        <div className="clarify-options-grid">
                          {detail.options.map((option, oIdx) => (
                            <button
                              key={oIdx}
                              className="clarify-option-choice-btn"
                              onClick={() => handleApplyClarification(detail.expression, option)}
                              title={`Resolve “${detail.expression}” as “${option}”`}
                            >
                              <CheckCircle2 size={13} />
                              <span>{option}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Custom answer row */}
                      <div className="clarify-custom-answer-row">
                        <input
                          className="clarify-custom-input"
                          placeholder={`Or specify what “${detail.expression}” means...`}
                          value={customAnswers[detail.expression] || ''}
                          onChange={(e) =>
                            setCustomAnswers((prev) => ({ ...prev, [detail.expression]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && customAnswers[detail.expression]?.trim()) {
                              handleApplyClarification(detail.expression, customAnswers[detail.expression].trim());
                            }
                          }}
                        />
                        <button
                          className="clarify-custom-submit-btn"
                          disabled={!customAnswers[detail.expression]?.trim()}
                          onClick={() => {
                            const val = customAnswers[detail.expression]?.trim();
                            if (val) handleApplyClarification(detail.expression, val);
                          }}
                        >
                          <Send size={13} />
                          <span>Apply</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="clarification-simple-list">
                    {result.clarifications.map((q, idx) => (
                      <div key={idx} className="clarify-simple-item">
                        <HelpCircle size={15} color="#f59e0b" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}
        </main>
      </div>
    </div>
  );
}
