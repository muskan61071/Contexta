import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  ArrowRight,
  FileText,
  ShieldAlert,
  Brain,
  Download,
  Filter,
  Eye,
  X,
  Layers,
  CheckCircle2,
  Calendar,
  HelpCircle
} from 'lucide-react';
import type { Analysis } from '../types';

interface Props {
  savedAnalyses: Analysis[];
  onSelectAnalysis: (analysis: Analysis) => void;
  onDeleteAnalysis: (id: string) => Promise<void>;
  onClearAllHistory: () => Promise<void>;
  onOpenAnalyzer: () => void;
}

export default function AnalysisHistory({
  savedAnalyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  onClearAllHistory,
  onOpenAnalyzer
}: Props) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [detailModalAnalysis, setDetailModalAnalysis] = useState<Analysis | null>(null);

  const filtered = savedAnalyses.filter((a) => {
    const matchesQuery =
      a.original.toLowerCase().includes(search.toLowerCase()) ||
      (a.intent && a.intent.toLowerCase().includes(search.toLowerCase())) ||
      (a.rewrite && a.rewrite.toLowerCase().includes(search.toLowerCase())) ||
      a.ambiguities.some((amb) => amb.expression.toLowerCase().includes(search.toLowerCase()));

    const matchesRisk = riskFilter === 'All' || a.risk === riskFilter;

    return matchesQuery && matchesRisk;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedAnalyses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `contexta_analysis_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleConfirmClearAll = async () => {
    if (savedAnalyses.length === 0) return;
    if (window.confirm('Are you sure you want to permanently delete all saved analyses?')) {
      await onClearAllHistory();
    }
  };

  return (
    <div className="history-page-container">
      {/* Header */}
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>PERSISTENT LOCAL ARCHIVE</span>
        </div>
        <h1>Analysis History & Records</h1>
        <p>
          Inspect, filter, export, and manage analyses saved in your local SQLite database.
        </p>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="history-control-toolbar">
        <div className="search-field-wrap">
          <Search size={15} />
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by utterance, intent, or ambiguous keyword…"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="filter-group">
          <span className="filter-label">Risk Filter:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((lvl) => (
            <button
              key={lvl}
              className={`filter-btn ${riskFilter === lvl ? 'active' : ''}`}
              onClick={() => setRiskFilter(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="history-global-actions">
          {savedAnalyses.length > 0 && (
            <>
              <button className="toolbar-btn export" onClick={handleExportJson} title="Export as JSON">
                <Download size={13} />
                <span>Export JSON</span>
              </button>
              <button className="toolbar-btn clear" onClick={handleConfirmClearAll} title="Clear all history">
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* History Records List */}
      {filtered.length > 0 ? (
        <div className="history-records-list">
          {filtered.map((item) => (
            <div key={item.id} className="history-record-card">
              <div className="record-main-col">
                <div className="record-top-meta">
                  <span className="record-timestamp">
                    <Calendar size={11} />
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                  <span className="record-amb-badge">
                    <Layers size={11} />
                    {item.ambiguities.length} Ambiguity Marker{item.ambiguities.length === 1 ? '' : 's'}
                  </span>
                  <span className="record-conf-tag">{item.confidence}% Evidence ({item.confidence_level})</span>
                </div>

                <h3 className="record-original-text">“{item.original}”</h3>

                {item.intent ? (
                  <div className="record-intent-row">
                    <Brain size={13} />
                    <span><strong>Reconstructed Intent:</strong> “{item.intent}”</span>
                  </div>
                ) : (
                  <div className="record-unresolved-row">
                    <HelpCircle size={13} />
                    <span>Requires clarification: {item.clarifications[0] || 'Unresolved references'}</span>
                  </div>
                )}
              </div>

              <div className="record-side-col">
                <span className={`risk-pill ${item.risk.toLowerCase()}`}>
                  <span />
                  {item.risk} Risk
                </span>

                <div className="record-actions-wrap">
                  <button
                    className="record-btn inspect"
                    onClick={() => setDetailModalAnalysis(item)}
                    title="View full report card"
                  >
                    <Eye size={14} />
                    <span>View Detail</span>
                  </button>
                  <button
                    className="record-btn load"
                    onClick={() => onSelectAnalysis(item)}
                    title="Load into Analyzer"
                  >
                    <span>Analyze</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    className="record-btn delete"
                    onClick={() => onDeleteAnalysis(item.id)}
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="history-empty-view">
          <HistoryIcon size={32} />
          <h3>No matching records found</h3>
          <p>
            {savedAnalyses.length === 0
              ? 'Run and save analyses in the workspace to build your history.'
              : 'Try clearing your search query or adjusting your risk filters.'}
          </p>
          <button className="primary-action-btn" onClick={onOpenAnalyzer}>
            <span>Go to Analyzer</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Analysis Detail Modal */}
      {detailModalAnalysis && (
        <div className="modal-backdrop" onClick={() => setDetailModalAnalysis(null)}>
          <div className="history-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <FileText size={18} />
                <h3>Analysis Report Card</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setDetailModalAnalysis(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <span className="modal-label">ORIGINAL UTTERANCE</span>
                <p className="modal-orig-text">“{detailModalAnalysis.original}”</p>
              </div>

              <div className="modal-grid-2">
                <div className="modal-section">
                  <span className="modal-label">CONFIDENCE & EVIDENCE</span>
                  <b>{detailModalAnalysis.confidence}% ({detailModalAnalysis.confidence_level})</b>
                </div>
                <div className="modal-section">
                  <span className="modal-label">MISCOMMUNICATION RISK</span>
                  <b className={`risk-text ${detailModalAnalysis.risk.toLowerCase()}`}>
                    {detailModalAnalysis.risk} Risk
                  </b>
                </div>
              </div>

              <div className="modal-section">
                <span className="modal-label">RECONSTRUCTED INTENT</span>
                <p className="modal-intent-text">
                  {detailModalAnalysis.intent || 'Insufficient context to select decisive intent without guessing.'}
                </p>
              </div>

              {detailModalAnalysis.rewrite && (
                <div className="modal-section">
                  <span className="modal-label">SUGGESTED CLEAR VERSION</span>
                  <p className="modal-rewrite-text">“{detailModalAnalysis.rewrite}”</p>
                </div>
              )}

              <div className="modal-section">
                <span className="modal-label">DETECTED AMBIGUITIES ({detailModalAnalysis.ambiguities.length})</span>
                <div className="modal-amb-list">
                  {detailModalAnalysis.ambiguities.map((a, i) => (
                    <div key={i} className="modal-amb-row">
                      <code>“{a.expression}”</code>
                      <span>{a.type}</span>
                      <strong>{a.resolved ? `→ ${a.resolved}` : 'Unresolved'}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <span className="modal-label">EXPLANATION</span>
                <p className="modal-exp-text">{detailModalAnalysis.explanation}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="primary-action-btn"
                onClick={() => {
                  onSelectAnalysis(detailModalAnalysis);
                  setDetailModalAnalysis(null);
                }}
              >
                <span>Load in Analyzer Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
