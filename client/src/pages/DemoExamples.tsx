import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Layers,
  HelpCircle,
  Tag,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { demos, DemoExample } from '../data/demoExamples';

interface Props {
  onLoadDemo: (index: number) => void;
  onOpenAnalyzer: () => void;
}

export default function DemoExamples({ onLoadDemo, onOpenAnalyzer }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = [
    'All',
    'Unclear reference',
    'Word with more than one meaning',
    'Sentence that can be grouped in different ways',
    'Missing details'
  ];

  const filteredDemos = demos.filter((d) => {
    if (activeCategory === 'All') return true;
    return d.category === activeCategory;
  });

  return (
    <div className="demos-page-container">
      {/* Header */}
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>CURATED LINGUISTIC TEST BENCH</span>
        </div>
        <h1>Realistic Communication Scenarios</h1>
        <p>
          Explore representative test cases illustrating each ambiguity dimension. Selecting a scenario loads its full conversation context and message into the live NLP pipeline.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="demos-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`demo-filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Demo Cards Grid */}
      <div className="demos-catalog-grid">
        {filteredDemos.map((demo) => {
          const globalIndex = demos.findIndex((d) => d.id === demo.id);

          return (
            <div key={demo.id} className="demo-catalog-card">
              <div className="demo-top-row">
                <span className={`cat-pill ${demo.category.toLowerCase()}`}>
                  {demo.category} Ambiguity
                </span>
                <span className="turns-pill">{demo.context.length} Context Turns</span>
              </div>

              <h3 className="demo-card-title">{demo.name}</h3>
              <p className="demo-card-desc">{demo.description}</p>

              {/* Message to Analyze Box */}
              <div className="demo-utterance-box">
                <span className="box-kicker">UTTERANCE TO ANALYZE</span>
                <p className="utterance-text">“{demo.message}”</p>
              </div>

              {/* Context Preview List */}
              <div className="demo-context-preview">
                <span className="box-kicker">PRIOR CONVERSATION CONTEXT</span>
                {demo.context.length > 0 ? (
                  <div className="ctx-preview-bubbles">
                    {demo.context.map((c, i) => (
                      <div key={i} className="mini-ctx-bubble">
                        <b>{c.speaker}:</b> <span>{c.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-ctx-mini">
                    <em>No earlier context provided (Tests honest uncertainty)</em>
                  </div>
                )}
              </div>

              {/* Expected Resolution Badge */}
              <div className="demo-expected-box">
                <CheckCircle2 size={13} />
                <span>
                  <strong>Expected Resolution:</strong> {demo.expectedHighlight}
                </span>
              </div>

              <button
                className="demo-launch-btn"
                onClick={() => onLoadDemo(globalIndex)}
              >
                <Sparkles size={14} />
                <span>Launch in Analyzer</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
