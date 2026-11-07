import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  Layers,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import type { Analysis, ContextMessage } from '../../types';

interface Props {
  contextMessages: ContextMessage[];
  message: string;
  result: Analysis | null;
  busy: boolean;
  onLoadScenario: (index: number) => void;
  onOpenProjectGuide: () => void;
  onAddQuickContext: () => void;
}

export default function RealtimeAssistantBanner({
  contextMessages,
  message,
  result,
  busy,
  onLoadScenario,
  onOpenProjectGuide,
  onAddQuickContext
}: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Dynamic state evaluation
  const hasContext = contextMessages.length > 0;
  const hasMessage = message.trim().length > 0;
  const hasResult = Boolean(result);
  const ambiguities = result?.ambiguities || [];
  const unresolvedAmbiguities = ambiguities.filter((a) => !a.resolved);
  const isHighRisk = result?.risk === 'High';
  const isResolved = hasResult && unresolvedAmbiguities.length === 0 && (result?.confidence || 0) >= 60;

  // Determine current workflow stage & dynamic guidance
  let currentStage = 1;
  let coachTitle = '';
  let coachDescription = '';
  let coachType: 'info' | 'warning' | 'success' | 'action' = 'info';
  let primaryActionLabel = '';
  let onPrimaryAction: (() => void) | null = null;

  if (!hasContext && !hasMessage) {
    currentStage = 1;
    coachTitle = 'Step 1: Ingest Conversation Context';
    coachDescription =
      'Real-world ambiguity arises when messages omit antecedents. Start by adding prior dialogue turns on the left, or launch a starter project scenario.';
    coachType = 'info';
    primaryActionLabel = 'Load Sample Project';
    onPrimaryAction = () => onLoadScenario(0);
  } else if (!hasContext && hasMessage) {
    currentStage = 1;
    coachTitle = 'Step 1 Needed: Pronouns require Context';
    coachDescription =
      'Your utterance contains references, but without conversation history Contexta cannot bind them. Add prior turns or click below.';
    coachType = 'warning';
    primaryActionLabel = 'Add Handoff Context';
    onPrimaryAction = onAddQuickContext;
  } else if (hasContext && !hasMessage) {
    currentStage = 2;
    coachTitle = 'Step 2: Draft or Paste Target Utterance';
    coachDescription =
      `Context is active with ${contextMessages.length} turn(s). Now compose the message to be analyzed (e.g. “Send it to her after that”) or test delegation.`;
    coachType = 'action';
    primaryActionLabel = 'Insert Test Message';
    onPrimaryAction = () => onLoadScenario(0);
  } else if (busy) {
    currentStage = 3;
    coachTitle = 'Step 3: Evaluating Discourse in Real Time…';
    coachDescription = 'Extracting entities, scanning referential dependencies, and matching candidate evidence…';
    coachType = 'info';
  } else if (hasResult && unresolvedAmbiguities.length > 0) {
    currentStage = 3;
    const exprList = unresolvedAmbiguities.map((a) => `“${a.expression}”`).join(', ');
    coachTitle = `Step 3: Unresolved Ambiguity Found (${unresolvedAmbiguities.length} items)`;
    coachDescription =
      `Unclear referents: ${exprList}. Miscommunication risk is ${result?.risk}. Use the Clarification Assistant below or add context to disambiguate.`;
    coachType = isHighRisk ? 'warning' : 'action';
    primaryActionLabel = 'Open Clarification Prompts';
    onPrimaryAction = () => {
      const el = document.querySelector('.highlight-clarify') || document.querySelector('.analysis-results-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
  } else if (isResolved) {
    currentStage = 4;
    coachTitle = `Step 4: All References Resolved (${result?.confidence}% Confidence)`;
    coachDescription =
      'Context confirmed all candidate referents! Review the "Make It Clear" section below to accept or copy the unambiguous wording before sending.';
    coachType = 'success';
    primaryActionLabel = 'Review Clear Rewrite';
    onPrimaryAction = () => {
      const el = document.querySelector('.make-it-clear-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
  } else {
    currentStage = 2;
    coachTitle = 'Step 2: Real-Time Preview Active';
    coachDescription = 'Live preview is evaluating changes as you type. Press ⌘/Ctrl+Enter or click Analyze to record to persistent history.';
    coachType = 'info';
  }

  return (
    <div className={`realtime-guide-banner ${coachType}`}>
      <div className="rgb-header">
        <div className="rgb-left">
          <div className="rgb-badge-icon">
            {coachType === 'success' ? (
              <ShieldCheck size={18} />
            ) : coachType === 'warning' ? (
              <AlertTriangle size={18} />
            ) : (
              <Compass size={18} />
            )}
          </div>
          <div>
            <div className="rgb-stage-tag">
              <span className="rgb-stage-num">STAGE {currentStage} OF 4</span>
              <span className="rgb-dot" />
              <span className="rgb-live-label">Interactive Project Coach</span>
            </div>
            <h4 className="rgb-title">{coachTitle}</h4>
          </div>
        </div>

        <div className="rgb-right-actions">
          {primaryActionLabel && onPrimaryAction && (
            <button className="rgb-primary-action-btn" onClick={onPrimaryAction}>
              <Sparkles size={13} />
              <span>{primaryActionLabel}</span>
              <ArrowRight size={13} />
            </button>
          )}

          <button
            className="rgb-guide-book-btn"
            onClick={onOpenProjectGuide}
            title="Open comprehensive project walkthrough"
          >
            <BookOpen size={14} />
            <span>Workflow Guide</span>
          </button>

          <button
            className="rgb-collapse-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse guide' : 'Expand guide'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="rgb-body">
          <p className="rgb-desc">{coachDescription}</p>

          {/* Interactive 4-Step Progress Track */}
          <div className="rgb-steps-track">
            <div className={`rgb-step-item ${hasContext ? 'completed' : currentStage === 1 ? 'active' : ''}`}>
              <div className="rgb-step-indicator">
                {hasContext ? <CheckCircle2 size={13} /> : <span>1</span>}
              </div>
              <div className="rgb-step-text">
                <b>Discourse Context</b>
                <small>{hasContext ? `${contextMessages.length} turns active` : 'Awaiting context'}</small>
              </div>
            </div>

            <span className="rgb-step-connector" />

            <div className={`rgb-step-item ${hasMessage ? 'completed' : currentStage === 2 ? 'active' : ''}`}>
              <div className="rgb-step-indicator">
                {hasMessage ? <CheckCircle2 size={13} /> : <span>2</span>}
              </div>
              <div className="rgb-step-text">
                <b>Target Utterance</b>
                <small>{hasMessage ? `${message.length} chars` : 'Type message'}</small>
              </div>
            </div>

            <span className="rgb-step-connector" />

            <div className={`rgb-step-item ${hasResult ? 'completed' : currentStage === 3 ? 'active' : ''}`}>
              <div className="rgb-step-indicator">
                {hasResult ? <CheckCircle2 size={13} /> : <span>3</span>}
              </div>
              <div className="rgb-step-text">
                <b>Ambiguity Scan</b>
                <small>{hasResult ? `${ambiguities.length} marker(s)` : 'Pending scan'}</small>
              </div>
            </div>

            <span className="rgb-step-connector" />

            <div className={`rgb-step-item ${isResolved ? 'completed' : currentStage === 4 ? 'active' : ''}`}>
              <div className="rgb-step-indicator">
                {isResolved ? <CheckCircle2 size={13} /> : <span>4</span>}
              </div>
              <div className="rgb-step-text">
                <b>Clear Resolution</b>
                <small>{isResolved ? 'Ready to send' : 'Requires clarification'}</small>
              </div>
            </div>
          </div>

          {/* Quick Scenario Launchers */}
          <div className="rgb-scenarios-row">
            <span className="rgb-scenarios-label">Quick Test Scenarios:</span>
            <button className="rgb-scenario-chip" onClick={() => onLoadScenario(0)}>
              📑 Handoff (Maya/Leo)
            </button>
            <button className="rgb-scenario-chip" onClick={() => onLoadScenario(1)}>
              👥 Delegation (Rahul/Arjun)
            </button>
            <button className="rgb-scenario-chip" onClick={() => onLoadScenario(2)}>
              🏦 Polysemy (Bank/Deposit)
            </button>
            <button className="rgb-scenario-chip" onClick={() => onLoadScenario(3)}>
              🔭 Telescope (Preposition)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
