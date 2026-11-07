import React from 'react';
import { MessageSquareQuote, CheckCircle, Info } from 'lucide-react';
import type { ContextQuote } from '../../types';

interface Props {
  contextUsed: ContextQuote[];
}

export default function ContextEvidence({ contextUsed }: Props) {
  if (!contextUsed || contextUsed.length === 0) {
    return (
      <div className="relevant-context-empty">
        <Info size={16} />
        <div>
          <b>No earlier messages directly informed resolution</b>
          <p>The system did not detect direct referential or lexical evidence in the provided context for this utterance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relevant-context-container">
      <div className="rel-context-header-note">
        <Info size={14} />
        <span>
          Showing only messages that provided measurable lexical, semantic, or referential evidence. Irrelevant turns were filtered out.
        </span>
      </div>

      <div className="rel-context-list">
        {contextUsed.map((item, idx) => (
          <div key={idx} className="rel-context-card">
            <div className="rel-context-top">
              <span className="rel-quote-icon">
                <MessageSquareQuote size={15} />
              </span>
              <p className="rel-quote-body">“{item.text}”</p>
            </div>
            <div className="rel-reason-row">
              <CheckCircle size={13} className="rel-check-icon" />
              <span className="rel-reason-text">
                <strong>Relevance justification:</strong> {item.reason}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
