import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  ClipboardPaste,
  Sparkles,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';
import type { ContextMessage } from '../../types';
import MessageBubble from './MessageBubble';
import { demos } from '../../data/demoExamples';

interface Props {
  messages: ContextMessage[];
  onMessagesChange: (messages: ContextMessage[]) => void;
  currentMessageText: string;
  onSelectAsTarget: (text: string) => void;
}

export default function ConversationPanel({
  messages,
  onMessagesChange,
  currentMessageText,
  onSelectAsTarget
}: Props) {
  const [tab, setTab] = useState<'thread' | 'paste' | 'demos'>('thread');
  const [newSpeaker, setNewSpeaker] = useState('Maya');
  const [newText, setNewText] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleAddSingle = () => {
    if (!newText.trim()) return;
    const msg: ContextMessage = {
      id: crypto.randomUUID(),
      speaker: newSpeaker.trim() || 'Context',
      text: newText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onMessagesChange([...messages, msg]);
    setNewText('');
  };

  const handleEditMessage = (id: string, newSpeaker: string, newText: string) => {
    onMessagesChange(
      messages.map((m) => (m.id === id ? { ...m, speaker: newSpeaker, text: newText } : m))
    );
  };

  const handleDeleteMessage = (id: string) => {
    onMessagesChange(messages.filter((m) => m.id !== id));
  };

  const handleClearAll = () => {
    if (messages.length === 0) return;
    if (window.confirm('Clear all conversation context messages?')) {
      onMessagesChange([]);
    }
  };

  const handleParseAndAddPaste = () => {
    if (!pasteContent.trim()) return;
    const lines = pasteContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed: ContextMessage[] = lines.map((line, idx) => {
      const match = line.match(/^([^:]{1,30}):\s*(.*)$/);
      return {
        id: crypto.randomUUID(),
        speaker: match ? match[1].trim() : (idx % 2 === 0 ? 'Maya' : 'Leo'),
        text: match ? match[2].trim() : line,
        timestamp: new Date(Date.now() - (lines.length - idx) * 60000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    });
    onMessagesChange([...messages, ...parsed]);
    setPasteContent('');
    setTab('thread');
  };

  const handleLoadDemoContext = (demoIndex: number) => {
    const d = demos[demoIndex];
    if (d) {
      onMessagesChange(d.context);
      onSelectAsTarget(d.message);
      setDemoMenuOpen(false);
      setTab('thread');
    }
  };

  return (
    <div className="conversation-panel-container">
      {/* Panel Top Header */}
      <div className="conv-panel-head">
        <div className="conv-head-title">
          <div className="conv-step-badge">01</div>
          <div>
            <h3>Conversation Context</h3>
            <p>Earlier messages help explain who or what your message means.</p>
          </div>
        </div>

        <div className="conv-head-actions">
          <div className="conv-mode-pills">
            <button
              className={`conv-tab-pill ${tab === 'thread' ? 'active' : ''}`}
              onClick={() => setTab('thread')}
              title="Chat bubble thread view"
            >
              <MessageSquare size={13} />
              <span>Messages ({messages.length})</span>
            </button>
            <button
              className={`conv-tab-pill ${tab === 'paste' ? 'active' : ''}`}
              onClick={() => setTab('paste')}
              title="Paste transcript text"
            >
              <ClipboardPaste size={13} />
              <span>Paste Chat</span>
            </button>
            <button
              className={`conv-tab-pill ${tab === 'demos' ? 'active' : ''}`}
              onClick={() => setTab('demos')}
              title="Load realistic scenario"
            >
              <Sparkles size={13} />
              <span>Examples</span>
            </button>
          </div>

          {messages.length > 0 && (
            <button
              className="conv-clear-btn"
              onClick={handleClearAll}
              title="Clear conversation context"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area based on Selected Tab */}
      {tab === 'thread' && (
        <div className="conv-thread-view">
          <div className="conv-bubble-list">
            {messages.length > 0 ? (
              messages.map((m, idx) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  index={idx}
                  isTarget={m.text.trim() === currentMessageText.trim()}
                  onDelete={handleDeleteMessage}
                  onEdit={handleEditMessage}
                  onSelectAsTarget={onSelectAsTarget}
                />
              ))
            ) : (
              <div className="conv-empty-state">
                <div className="conv-empty-icon">
                  <Users size={22} />
                </div>
                <b>No earlier messages yet</b>
                <p>
                  Add earlier messages or paste a chat. This gives Contexta clues about names and words like “it” or “they”.
                </p>
                <div className="conv-empty-actions">
                  <button className="conv-quick-demo-btn" onClick={() => handleLoadDemoContext(0)}>
                    <Sparkles size={13} /> Load “Report & Meeting” scenario
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Message Form */}
          <div className="conv-add-box">
            <div className="conv-add-row">
              <input
                className="conv-speaker-input"
                value={newSpeaker}
                onChange={(e) => setNewSpeaker(e.target.value)}
                placeholder="Speaker (e.g. Maya)"
                maxLength={30}
              />
              <input
                className="conv-text-input"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSingle();
                }}
                placeholder="Type earlier message text (e.g. “The report is ready”)..."
                maxLength={500}
              />
              <button
                className="conv-add-btn"
                onClick={handleAddSingle}
                disabled={!newText.trim()}
                title="Add message turn to conversation context"
              >
                <Plus size={15} /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'paste' && (
        <div className="conv-paste-view">
          <div className="paste-instructions">
            <b>Paste Chat Transcript</b>
            <p>
              Paste conversation text with one turn per line. Format lines as <code>Speaker: Message</code> or just text.
            </p>
          </div>
          <textarea
            className="conv-paste-textarea"
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder={`Maya: The project report is ready.\nLeo: Priya needs the report before 4 PM.\nMaya: The review meeting is scheduled for 3 PM.`}
            rows={5}
          />
          <div className="conv-paste-actions">
            <button
              className="conv-paste-submit-btn"
              onClick={handleParseAndAddPaste}
              disabled={!pasteContent.trim()}
            >
              <CheckCircle2 size={14} /> Parse & Add into Context
            </button>
            <button className="conv-paste-cancel-btn" onClick={() => setTab('thread')}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {tab === 'demos' && (
        <div className="conv-presets-view">
          <div className="presets-heading">
            <b>Curated Context Presets</b>
            <p>Select any realistic scenario to populate both context and message instantly:</p>
          </div>
          <div className="preset-cards-list">
            {demos.map((d, i) => (
              <div
                key={d.id}
                className="preset-item-card"
                onClick={() => handleLoadDemoContext(i)}
              >
                <div className="preset-top">
                  <span className="preset-category">{d.category}</span>
                  <b>{d.name}</b>
                </div>
                <p className="preset-desc">{d.description}</p>
                <div className="preset-preview-row">
                  <code>“{d.message}”</code>
                  <span className="preset-turns-badge">{d.context.length} context turns</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
