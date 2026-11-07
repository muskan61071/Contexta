import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Tag,
  Info
} from 'lucide-react';
import type { Analysis, Ambiguity } from '../types';

interface Props {
  analysis: Analysis | null;
  onOpenAnalyzer: () => void;
  onLoadExample?: (index: number) => void;
}

interface AmbiguityCategoryMeta {
  title: string;
  badge: string;
  color: string;
  description: string;
  exampleSentence: string;
  demoIndex: number;
  linguisticDiagnostic: string;
}

const ambiguityTaxonomy: Record<string, AmbiguityCategoryMeta> = {
  'Pronoun': {
    title: 'Pronoun Ambiguity',
    badge: 'Coreference / Anaphora',
    color: '#6366f1',
    description: 'Third-person pronouns (it, he, she, they, him, her, them) lack independent semantic reference and must resolve to an antecedent in discourse context.',
    exampleSentence: '“Send it to her after that”',
    demoIndex: 0,
    linguisticDiagnostic: 'Evaluates gender, number agreement, recency weights, and grammatical role salience.'
  },
  'Referential': {
    title: 'Referential Ambiguity',
    badge: 'Deictic / Spatial / Temporal',
    color: '#0ea5e9',
    description: 'Demonstrative pronouns and adverbials (this, that, there, here, after that, before this) whose denotation shifts with temporal or situational context.',
    exampleSentence: '“Ask them to send it after that”',
    demoIndex: 7,
    linguisticDiagnostic: 'Distinguishes event/meeting references from concrete direct objects based on prepositions.'
  },
  'Lexical': {
    title: 'Lexical Ambiguity (Polysemy)',
    badge: 'Word Sense Disambiguation',
    color: '#f59e0b',
    description: 'Words possessing distinct, non-overlapping dictionary senses (e.g. bank as financial institution vs riverbank; charge as fee vs electrical).',
    exampleSentence: '“I went to the bank”',
    demoIndex: 4,
    linguisticDiagnostic: 'Analyzes co-occurrence of domain keywords (deposit/cheque vs river/water).'
  },
  'Syntactic': {
    title: 'Syntactic / Structural Ambiguity',
    badge: 'Parse Tree / PP Attachment',
    color: '#a855f7',
    description: 'Sentences having more than one grammatical parse tree. Prepositional phrases can attach to the verb phrase (instrument) or noun phrase (modifier/possession).',
    exampleSentence: '“I saw the man with the telescope”',
    demoIndex: 2,
    linguisticDiagnostic: 'Generates parallel parse readings: speaker instrument vs person modifier.'
  },
  'Semantic': {
    title: 'Semantic / Binding Ambiguity',
    badge: 'Binding Principles / Role Assignment',
    color: '#ef4444',
    description: 'Unclear thematic roles or coreference binding between multiple agents and addressees within the same sentence structure.',
    exampleSentence: '“Rahul told Arjun that he should submit the report”',
    demoIndex: 3,
    linguisticDiagnostic: 'Identifies candidate agents and queries context for assigned responsibilities.'
  },
  'Contextual': {
    title: 'Contextual Ambiguity',
    badge: 'Discourse State Deficiency',
    color: '#10b981',
    description: 'Utterances that appear grammatically sound in isolation but fail in communication because critical background information is missing.',
    exampleSentence: '“Send it to her” (zero context)',
    demoIndex: 1,
    linguisticDiagnostic: 'Evaluates uncertainty threshold and flags miscommunication risk without guessing.'
  }
};

export default function AmbiguityAnalysis({ analysis, onOpenAnalyzer, onLoadExample }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const ambiguities: Ambiguity[] = analysis?.ambiguities || [];

  const filteredAmbiguities = ambiguities.filter((a) => {
    if (selectedFilter === 'All') return true;
    return a.type.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <div className="ambiguity-page-container">
      {/* Header */}
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>LINGUISTIC TAXONOMY & DIAGNOSTICS</span>
        </div>
        <h1>Ambiguity Analysis & Classification</h1>
        <p>
          Diagnosing the six principal classes of human communication ambiguity: pronoun, referential, lexical polysemy, syntactic attachment, semantic binding, and contextual insufficiency.
        </p>
      </div>

      {/* Active Analysis Results if Available */}
      {analysis && (
        <section className="active-analysis-amb-section">
          <div className="active-amb-head">
            <div className="head-left">
              <span className="live-pulse" />
              <h3>Current Message Diagnostic: “{analysis.original}”</h3>
            </div>
            <span className="detected-count-badge">
              {ambiguities.length} Ambiguity Marker{ambiguities.length === 1 ? '' : 's'} Detected
            </span>
          </div>

          {/* Filter Pills */}
          <div className="amb-filter-pills">
            {['All', 'Pronoun', 'Referential', 'Lexical', 'Syntactic', 'Semantic'].map((f) => (
              <button
                key={f}
                className={`amb-filter-btn ${selectedFilter === f ? 'active' : ''}`}
                onClick={() => setSelectedFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="amb-diagnostic-cards-grid">
            {filteredAmbiguities.map((item, idx) => (
              <div key={idx} className="amb-diag-card">
                <div className="diag-card-top">
                  <code className="diag-expr">“{item.expression}”</code>
                  <span className="diag-type-tag">{item.type}</span>
                </div>

                <p className="diag-reason">{item.reason}</p>

                <div className="diag-candidates-block">
                  <span className="diag-sub-label">Discourse Candidates:</span>
                  <div className="diag-cand-chips">
                    {item.candidates.map((c, i) => (
                      <span
                        key={i}
                        className={`diag-cand-chip ${item.resolved?.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
                      >
                        {item.resolved?.toLowerCase() === c.toLowerCase() && <CheckCircle size={11} />}
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="diag-footer">
                  <div className="diag-conf-bar">
                    <div className="diag-conf-fill" style={{ width: `${item.confidence}%` }} />
                  </div>
                  <span className="diag-conf-text">{item.confidence}% Evidence Strength</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Complete Ambiguity Taxonomy Guide */}
      <section className="taxonomy-reference-section">
        <div className="section-head">
          <div className="section-eyebrow">LINGUISTIC PRINCIPLES</div>
          <h2>The 6 Dimensions of Message Ambiguity</h2>
          <p>
            How the Contexta engine analyzes each form of linguistic uncertainty and applies contextual evidence:
          </p>
        </div>

        <div className="taxonomy-cards-grid">
          {Object.entries(ambiguityTaxonomy).map(([key, meta]) => (
            <div key={key} className="taxonomy-card">
              <div className="tax-top">
                <span className="tax-badge" style={{ backgroundColor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}40` }}>
                  {meta.badge}
                </span>
                <span className="tax-category-label">{meta.title}</span>
              </div>

              <p className="tax-desc">{meta.description}</p>

              <div className="tax-example-box">
                <span className="tax-ex-label">Canonical Example:</span>
                <code className="tax-ex-code">{meta.exampleSentence}</code>
              </div>

              <div className="tax-diag-box">
                <Info size={13} style={{ color: meta.color }} />
                <span>{meta.linguisticDiagnostic}</span>
              </div>

              {onLoadExample && (
                <button
                  className="tax-try-btn"
                  onClick={() => onLoadExample(meta.demoIndex)}
                >
                  <span>Test in Analyzer</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
