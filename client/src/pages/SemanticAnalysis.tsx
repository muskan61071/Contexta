import React, { useState } from 'react';
import {
  Waypoints,
  ArrowRight,
  User,
  Zap,
  Box,
  Send,
  Clock,
  MapPin,
  Sparkles,
  Info,
  Layers,
  Database
} from 'lucide-react';
import type { Analysis, Relationship } from '../types';
import SemanticRelationshipGraph from '../components/semantic/SemanticRelationshipGraph';

interface Props {
  analysis: Analysis | null;
  onOpenAnalyzer: () => void;
  onLoadExample?: (index: number) => void;
}

export default function SemanticAnalysis({ analysis, onOpenAnalyzer, onLoadExample }: Props) {
  const [testSentence, setTestSentence] = useState('Rahul sent Priya the project report');
  const [customRoles, setCustomRoles] = useState<Relationship[]>([
    { role: 'Person / entity', value: 'Rahul' },
    { role: 'Action', value: 'sent' },
    { role: 'Recipient / other', value: 'Priya' },
    { role: 'Object', value: 'the project report' }
  ]);

  const activeRelationships: Relationship[] =
    analysis && analysis.relationships.length > 0
      ? analysis.relationships
      : customRoles;

  const currentMessageLabel = analysis ? `Current Message: “${analysis.original}”` : `Interactive Demo Frame: “${testSentence}”`;

  const handleTestSentence = (sentence: string) => {
    setTestSentence(sentence);
    // Lightweight local heuristic parser for live demo
    const roles: Relationship[] = [];
    if (/rahul/i.test(sentence)) roles.push({ role: 'Person / entity', value: 'Rahul' });
    if (/maya/i.test(sentence)) roles.push({ role: 'Person / entity', value: 'Maya' });
    if (/arjun/i.test(sentence)) roles.push({ role: 'Person / entity', value: 'Arjun' });
    if (/priya/i.test(sentence)) roles.push({ role: 'Recipient / other', value: 'Priya' });
    if (/send|sent/i.test(sentence)) roles.push({ role: 'Action', value: 'sent' });
    if (/give|gave/i.test(sentence)) roles.push({ role: 'Action', value: 'gave' });
    if (/submit/i.test(sentence)) roles.push({ role: 'Action', value: 'submit' });
    if (/saw|see/i.test(sentence)) roles.push({ role: 'Action', value: 'saw' });
    if (/went/i.test(sentence)) roles.push({ role: 'Action', value: 'went' });
    if (/project report|report/i.test(sentence)) roles.push({ role: 'Object', value: 'the project report' });
    if (/assignment/i.test(sentence)) roles.push({ role: 'Object', value: 'the assignment' });
    if (/telescope/i.test(sentence)) roles.push({ role: 'Instrument / Modifier', value: 'with the telescope' });
    if (/bank/i.test(sentence)) roles.push({ role: 'Location', value: 'the bank' });
    if (/tomorrow|today|3 pm/i.test(sentence)) {
      const tm = sentence.match(/\b(tomorrow|today|3 pm)\b/i);
      if (tm) roles.push({ role: 'Time', value: tm[0] });
    }
    setCustomRoles(roles.length ? roles : [{ role: 'Person / entity', value: 'Speaker' }, { role: 'Action', value: 'communicates' }]);
  };

  return (
    <div className="semantic-page-container">
      {/* Header */}
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>CASE GRAMMAR & THEMATIC ROLES</span>
        </div>
        <h1>Semantic Relationship Graph & Role Memory</h1>
        <p>
          Extracts entity-action relationships (Agent → Action → Object → Recipient) and preserves discourse role memory across conversation turns to resolve downstream anaphoric references.
        </p>
      </div>

      {/* Primary Visual Graph Canvas */}
      <section className="semantic-canvas-section">
        <div className="canvas-header-strip">
          <div className="strip-title-group">
            <span className="pulse-dot-indigo" />
            <h3>{currentMessageLabel}</h3>
          </div>
          <span className="canvas-roles-count">
            {activeRelationships.length} Extracted Thematic Roles
          </span>
        </div>

        <SemanticRelationshipGraph
          relationships={activeRelationships}
          graph={analysis?.semantic_graph}
        />
      </section>

      {/* Cross-Turn Semantic Memory Walkthrough */}
      <section className="semantic-memory-showcase">
        <div className="section-head">
          <div className="section-eyebrow">THEMATIC MEMORY PROPAGATION</div>
          <h2>How Semantic Roles Disambiguate Subsequent Pronouns</h2>
          <p>
            When a previous message establishes explicit thematic roles, the system remembers them. In subsequent turns, pronouns inherit the corresponding discourse slot:
          </p>
        </div>

        <div className="cross-turn-card">
          <div className="turn-step-block turn-1">
            <div className="turn-step-head">
              <span className="turn-pill">TURN 1: EARLIER CONTEXT</span>
              <b>“Rahul sent Priya the project report”</b>
            </div>
            <div className="roles-pill-row">
              <span className="thematic-pill agent"><User size={12} /> Agent: Rahul</span>
              <span className="thematic-pill action"><Zap size={12} /> Action: sent</span>
              <span className="thematic-pill recip"><Send size={12} /> Recipient: Priya</span>
              <span className="thematic-pill obj"><Box size={12} /> Object: project report</span>
            </div>
          </div>

          <div className="turn-memory-bridge">
            <div className="bridge-line" />
            <span className="bridge-label">Role Slots Stored in Discourse Memory</span>
            <div className="bridge-line" />
          </div>

          <div className="turn-step-block turn-2">
            <div className="turn-step-head">
              <span className="turn-pill green">TURN 2: SUBSEQUENT UTTERANCE</span>
              <b>“Send it to her again”</b>
            </div>
            <div className="role-mapping-resolutions">
              <div className="map-res-item">
                <code>“it”</code>
                <ArrowRight size={13} />
                <span>Matches Object Slot → <strong>the project report</strong></span>
              </div>
              <div className="map-res-item">
                <code>“her”</code>
                <ArrowRight size={13} />
                <span>Matches Recipient Slot → <strong>Priya</strong></span>
              </div>
            </div>
          </div>

          {onLoadExample && (
            <div className="memory-action-footer">
              <button className="memory-load-btn" onClick={() => onLoadExample(5)}>
                <Sparkles size={14} />
                <span>Test this exact scenario in Analyzer</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Thematic Roles Definition Guide */}
      <section className="thematic-roles-glossary">
        <div className="section-head">
          <div className="section-eyebrow">ROLE ONTOLOGY</div>
          <h2>Supported Semantic Roles</h2>
          <p>Structured linguistic roles recognized by the Contexta semantic extraction pipeline:</p>
        </div>

        <div className="roles-glossary-grid">
          <div className="glossary-item-card">
            <div className="g-icon purple"><User size={16} /></div>
            <h4>Agent (Performer)</h4>
            <p>The entity that actively initiates or performs the event or action.</p>
            <code>e.g. “<strong>Rahul</strong> sent…”, “<strong>Maya</strong> reviewed…”</code>
          </div>

          <div className="glossary-item-card">
            <div className="g-icon red"><Zap size={16} /></div>
            <h4>Action (Predicate)</h4>
            <p>The verbal core describing the state, event, or transfer taking place.</p>
            <code>e.g. “…<strong>sent</strong>…”, “…<strong>scheduled</strong>…”, “…<strong>saw</strong>…”</code>
          </div>

          <div className="glossary-item-card">
            <div className="g-icon green"><Box size={16} /></div>
            <h4>Direct Object (Theme/Patient)</h4>
            <p>The entity or deliverable that is acted upon, created, or transferred.</p>
            <code>e.g. “…the <strong>project report</strong>”, “…the <strong>contract</strong>”</code>
          </div>

          <div className="glossary-item-card">
            <div className="g-icon amber"><Send size={16} /></div>
            <h4>Recipient / Beneficiary</h4>
            <p>The person or entity targeted to receive the object or outcome.</p>
            <code>e.g. “…to <strong>Priya</strong>”, “…for the <strong>client</strong>”</code>
          </div>

          <div className="glossary-item-card">
            <div className="g-icon blue"><Clock size={16} /></div>
            <h4>Temporal Qualifier</h4>
            <p>The event, timestamp, or timeline anchor constraining the action.</p>
            <code>e.g. “…at <strong>3 PM</strong>”, “…after <strong>the meeting</strong>”</code>
          </div>

          <div className="glossary-item-card">
            <div className="g-icon purple-light"><MapPin size={16} /></div>
            <h4>Location / Setting</h4>
            <p>The physical or institutional environment where the action occurs.</p>
            <code>e.g. “…at <strong>the bank</strong>”, “…in the <strong>conference room</strong>”</code>
          </div>
        </div>
      </section>
    </div>
  );
}
