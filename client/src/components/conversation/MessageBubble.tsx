import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Sparkles, Clock } from 'lucide-react';
import type { ContextMessage } from '../../types';

interface Props {
  message: ContextMessage;
  index?: number;
  isTarget?: boolean;
  highlight?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newSpeaker: string, newText: string) => void;
  onSelectAsTarget?: (text: string) => void;
}

const toneGradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)'
];

export default function MessageBubble({
  message,
  index = 0,
  isTarget = false,
  highlight = false,
  onDelete,
  onEdit,
  onSelectAsTarget
}: Props) {
  const isSelected = isTarget || highlight;
  const [isEditing, setIsEditing] = useState(false);
  const [speakerDraft, setSpeakerDraft] = useState(message.speaker);
  const [textDraft, setTextDraft] = useState(message.text);

  const tone = toneGradients[index % toneGradients.length];
  const initial = (message.speaker || 'C').charAt(0).toUpperCase();

  const handleSave = () => {
    if (textDraft.trim() && onEdit) {
      onEdit(message.id, speakerDraft.trim() || 'Context', textDraft.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setSpeakerDraft(message.speaker);
    setTextDraft(message.text);
    setIsEditing(false);
  };

  return (
    <div className={`message-bubble-wrapper ${isSelected ? 'is-target' : ''}`}>
      <div className="bubble-avatar" style={{ background: tone }}>
        {initial}
      </div>

      <div className="bubble-content-card">
        <div className="bubble-header">
          {isEditing ? (
            <input
              className="bubble-edit-speaker"
              value={speakerDraft}
              onChange={(e) => setSpeakerDraft(e.target.value)}
              placeholder="Speaker"
            />
          ) : (
            <b className="bubble-speaker">{message.speaker}</b>
          )}

          <div className="bubble-meta">
            <span className="bubble-time">
              <Clock size={10} />
              {message.timestamp || `Turn #${index + 1}`}
            </span>
            {isTarget && <span className="bubble-target-badge">Current Target</span>}
          </div>
        </div>

        {isEditing ? (
          <div className="bubble-edit-area">
            <textarea
              className="bubble-edit-text"
              value={textDraft}
              onChange={(e) => setTextDraft(e.target.value)}
              rows={2}
            />
            <div className="bubble-edit-actions">
              <button className="bubble-act-btn save" onClick={handleSave} title="Save changes">
                <Check size={13} /> Save
              </button>
              <button className="bubble-act-btn cancel" onClick={handleCancel} title="Cancel">
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <p className="bubble-text">{message.text}</p>
        )}

        <div className="bubble-footer-actions">
          {!isEditing && onSelectAsTarget && !isTarget && (
            <button
              className="bubble-action-btn analyze-this"
              onClick={() => onSelectAsTarget(message.text)}
              title="Set this message as current message to analyze"
            >
              <Sparkles size={11} /> Analyze this
            </button>
          )}

          {!isEditing && onEdit && (
            <button
              className="bubble-action-btn"
              onClick={() => setIsEditing(true)}
              title="Edit message"
            >
              <Edit2 size={11} /> Edit
            </button>
          )}

          {onDelete && (
            <button
              className="bubble-action-btn delete"
              onClick={() => onDelete(message.id)}
              title="Remove from conversation"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
