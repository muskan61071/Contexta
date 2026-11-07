import React, { useState } from 'react';
import { Copy, Check, CheckCircle2, ArrowRight, Edit3, Sparkles, FileText, Info } from 'lucide-react';
import type { Analysis, ReplacementItem } from '../../types';

interface Props {
  analysis: Analysis;
  onAcceptRewrite?: (clearText: string) => void;
}

export default function RewriteCard({ analysis, onAcceptRewrite }: Props) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(analysis.rewrite || '');

  const clearText = isEditing ? editedText : analysis.rewrite || analysis.original;
  const isAvailable = Boolean(analysis.rewrite && analysis.intent);

  const replacements: ReplacementItem[] = analysis.replacement_map || 
    analysis.ambiguities
      .filter((a) => a.resolved)
      .map((a) => ({
        original: a.expression,
        resolved: a.resolved!,
        reason: a.reason
      }));

  const handleCopy = async () => {
    if (!clearText) return;
    await navigator.clipboard.writeText(clearText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    if (onAcceptRewrite && clearText) {
      onAcceptRewrite(clearText);
    }
  };

  return (
    <div className="make-it-clear-card">
      <div className="mic-header">
        <div className="mic-badge-icon">
          <Sparkles size={18} />
        </div>
        <div>
          <h3>Make It Clear</h3>
          <p>Check this wording before you copy or use it.</p>
        </div>
        {isAvailable && <span className="mic-status-pill">Review first</span>}
      </div>

      <div className="mic-comparison-container">
        {/* Original Message Block */}
        <div className="mic-message-block original">
          <div className="mic-block-top">
            <span className="mic-block-kicker">ORIGINAL MESSAGE</span>
            <span className="mic-amb-count">
              {analysis.ambiguities.length} ambiguous item{analysis.ambiguities.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mic-block-text">“{analysis.original}”</p>
        </div>

        <div className="mic-arrow-divider">
          <ArrowRight size={18} />
        </div>

        {/* Clear Version Block */}
        <div className={`mic-message-block clear ${isAvailable ? 'available' : 'pending'}`}>
          <div className="mic-block-top">
            <span className="mic-block-kicker green">SUGGESTED CLEAR REWRITE</span>
            <div className="mic-block-actions">
              {isAvailable && !isEditing && (
                <button
                  className="mic-mini-btn"
                  onClick={() => {
                    setEditedText(analysis.rewrite || '');
                    setIsEditing(true);
                  }}
                  title="Customize rewrite text"
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
              <button
                className={`mic-copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                disabled={!isAvailable}
                title="Copy clearer message to clipboard"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="mic-inline-edit">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={2}
                className="mic-edit-textarea"
              />
              <button
                className="mic-save-edit-btn"
                onClick={() => setIsEditing(false)}
              >
                <Check size={12} /> Done Editing
              </button>
            </div>
          ) : (
            <p className="mic-block-text clear-text">
              {isAvailable
                ? `“${analysis.rewrite}”`
                : 'No rewrite suggested yet because conversation evidence is not enough to know the intended meaning. Please review the questions and unclear elements below.'}
            </p>
          )}

          {isAvailable && onAcceptRewrite && (
            <div className="mic-accept-footer">
              <button className="mic-accept-btn" onClick={handleAccept}>
                <CheckCircle2 size={14} /> Accept as current message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replaced References Breakdown */}
      {replacements.length > 0 && (
        <div className="mic-replacements-section">
          <span className="mic-replacements-title">Replaced Ambiguous References:</span>
          <div className="mic-replacements-grid">
            {replacements.map((r, i) => (
              <div key={i} className="mic-replacement-pill">
                <code className="mic-orig-code">{r.original}</code>
                <ArrowRight size={12} />
                <strong className="mic-resolved-val">{r.resolved}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation of Why it is Clearer */}
      <div className="mic-why-better">
        <Info size={14} />
        <div>
          <b>Why this version prevents miscommunication:</b>
          <p>
            Pronouns and demonstratives like {analysis.ambiguities.map((a) => `“${a.expression}”`).join(', ')} require the recipient to mentally reconstruct your antecedent. Replacing them with explicit named entities guarantees zero ambiguity regardless of how many messages follow.
          </p>
        </div>
      </div>
    </div>
  );
}
