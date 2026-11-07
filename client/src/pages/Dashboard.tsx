import React, { useMemo } from 'react';
import {
  BarChart3,
  MessageSquare,
  Layers,
  CheckCircle2,
  HelpCircle,
  FileText,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import type { Analysis } from '../types';

interface Props {
  savedAnalyses: Analysis[];
  onOpenAnalyzer: () => void;
  onLoadExample?: (index: number) => void;
}

export default function Dashboard({ savedAnalyses, onOpenAnalyzer, onLoadExample }: Props) {
  // Compute real metrics from saved analyses (never random!)
  const metrics = useMemo(() => {
    const total = savedAnalyses.length;
    const allAmbiguities = savedAnalyses.flatMap((a) => a.ambiguities || []);
    const resolvedAmbiguities = allAmbiguities.filter((a) => a.resolved);
    const totalClarifications = savedAnalyses.reduce(
      (sum, a) => sum + (a.clarifications?.length || 0),
      0
    );
    const messagesRewritten = savedAnalyses.filter((a) => a.rewrite && a.rewrite !== a.original).length;
    const highRisk = savedAnalyses.filter((a) => a.risk === 'High').length;
    const mediumRisk = savedAnalyses.filter((a) => a.risk === 'Medium').length;
    const lowRisk = savedAnalyses.filter((a) => a.risk === 'Low').length;

    const avgConfidence = total
      ? Math.round(savedAnalyses.reduce((sum, a) => sum + (a.confidence || 0), 0) / total)
      : 0;

    const resolutionRate = allAmbiguities.length
      ? Math.round((resolvedAmbiguities.length / allAmbiguities.length) * 100)
      : 100;

    // Ambiguity Type Distribution across the 4 core categories
    const typeCounts: Record<string, number> = {
      'Unclear references': 0,
      'Multiple meanings': 0,
      'Grouping ambiguity': 0,
      'Missing details': 0
    };

    allAmbiguities.forEach((a) => {
      const k = ((a.kind || '') + ' ' + (a.type || '')).toLowerCase();
      if (k.includes('meaning') || k.includes('lexical') || k.includes('polysemy')) {
        typeCounts['Multiple meanings']++;
      } else if (k.includes('group') || k.includes('attachment') || k.includes('syntactic')) {
        typeCounts['Grouping ambiguity']++;
      } else if (k.includes('missing') || k.includes('detail') || k.includes('directive')) {
        typeCounts['Missing details']++;
      } else {
        typeCounts['Unclear references']++;
      }
    });

    return {
      total,
      totalAmbiguities: allAmbiguities.length,
      resolvedCount: resolvedAmbiguities.length,
      resolutionRate,
      totalClarifications,
      messagesRewritten,
      highRisk,
      mediumRisk,
      lowRisk,
      avgConfidence,
      typeCounts
    };
  }, [savedAnalyses]);

  const maxTypeCount = Math.max(1, ...Object.values(metrics.typeCounts));

  return (
    <div className="dashboard-page-container">
      {/* Header */}
      <div className="page-header-standard">
        <div className="page-eyebrow">
          <span className="eyebrow-line" />
          <span>EVIDENCE-BASED DISCOURSE METRICS</span>
        </div>
        <h1>Communication Intelligence Dashboard</h1>
        <p>
          Derived strictly from saved analyses in your local workspace. All metrics, resolution rates, and risk profiles reflect real user messages and conversation evidence.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="dash-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap indigo">
            <MessageSquare size={18} />
          </div>
          <span className="kpi-label">Messages Analyzed</span>
          <b className="kpi-value">{metrics.total}</b>
          <span className="kpi-sub">Total utterances evaluated</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap purple">
            <Layers size={18} />
          </div>
          <span className="kpi-label">Ambiguities Detected</span>
          <b className="kpi-value">{metrics.totalAmbiguities}</b>
          <span className="kpi-sub">Across all 6 taxonomies</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap emerald">
            <CheckCircle2 size={18} />
          </div>
          <span className="kpi-label">References Resolved</span>
          <b className="kpi-value">{metrics.resolvedCount}</b>
          <span className="kpi-sub">{metrics.resolutionRate}% resolution efficiency</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap amber">
            <HelpCircle size={18} />
          </div>
          <span className="kpi-label">Clarifications Generated</span>
          <b className="kpi-value">{metrics.totalClarifications}</b>
          <span className="kpi-sub">Prevented blind guessing</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap cyan">
            <FileText size={18} />
          </div>
          <span className="kpi-label">Messages Rewritten</span>
          <b className="kpi-value">{metrics.messagesRewritten}</b>
          <span className="kpi-sub">Converted into explicit intent</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap rose">
            <ShieldAlert size={18} />
          </div>
          <span className="kpi-label">High-Risk Messages</span>
          <b className="kpi-value">{metrics.highRisk}</b>
          <span className="kpi-sub">Critical ambiguity flagged</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <Activity size={18} />
          </div>
          <span className="kpi-label">Average Confidence</span>
          <b className="kpi-value">{metrics.avgConfidence}%</b>
          <span className="kpi-sub">Grounded evidence strength</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="dash-visuals-grid">
        {/* Ambiguity Types Distribution Chart */}
        <div className="dash-panel-card">
          <div className="dash-panel-head">
            <div className="panel-title-group">
              <Layers size={16} />
              <h3>Ambiguity Types Distribution</h3>
            </div>
            <span className="panel-note">Real occurrence counts</span>
          </div>

          <div className="amb-bar-chart-container">
            {Object.entries(metrics.typeCounts).map(([type, count]) => {
              const pct = Math.round((count / maxTypeCount) * 100);
              return (
                <div key={type} className="amb-chart-row">
                  <span className="chart-row-label">{type}</span>
                  <div className="chart-bar-track">
                    <div
                      className={`chart-bar-fill ${type.toLowerCase()}`}
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                  <span className="chart-row-val">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Miscommunication Risk Breakdown */}
        <div className="dash-panel-card">
          <div className="dash-panel-head">
            <div className="panel-title-group">
              <ShieldCheck size={16} />
              <h3>Miscommunication Risk Breakdown</h3>
            </div>
            <span className="panel-note">{metrics.total} Total Analyses</span>
          </div>

          <div className="risk-donut-container">
            <div className="risk-bars-stack">
              <div className="risk-stat-item low">
                <div className="risk-stat-header">
                  <span className="risk-dot green" />
                  <b>Low Risk</b>
                  <span className="risk-stat-count">{metrics.lowRisk}</span>
                </div>
                <div className="risk-progress-track">
                  <div
                    className="risk-progress-bar low"
                    style={{
                      width: `${metrics.total ? (metrics.lowRisk / metrics.total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="risk-stat-item medium">
                <div className="risk-stat-header">
                  <span className="risk-dot amber" />
                  <b>Medium Risk</b>
                  <span className="risk-stat-count">{metrics.mediumRisk}</span>
                </div>
                <div className="risk-progress-track">
                  <div
                    className="risk-progress-bar medium"
                    style={{
                      width: `${metrics.total ? (metrics.mediumRisk / metrics.total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="risk-stat-item high">
                <div className="risk-stat-header">
                  <span className="risk-dot red" />
                  <b>High Risk</b>
                  <span className="risk-stat-count">{metrics.highRisk}</span>
                </div>
                <div className="risk-progress-track">
                  <div
                    className="risk-progress-bar high"
                    style={{
                      width: `${metrics.total ? (metrics.highRisk / metrics.total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="resolution-gauge-box">
              <span className="gauge-kicker">REFERENCE RESOLUTION RATE</span>
              <b className="gauge-rate">{metrics.resolutionRate}%</b>
              <p>
                {metrics.resolvedCount} of {metrics.totalAmbiguities} detected references successfully matched with conversation antecedents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analysis Activity Timeline */}
      <div className="dash-panel-card full-width">
        <div className="dash-panel-head">
          <div className="panel-title-group">
            <Activity size={16} />
            <h3>Recent Analysis Timeline</h3>
          </div>
          <span className="panel-note">Chronological volume & risk profile</span>
        </div>

        {savedAnalyses.length > 0 ? (
          <div className="dash-activity-timeline">
            {savedAnalyses.slice(0, 14).reverse().map((a, i) => (
              <div
                key={a.id}
                className="activity-bar-column"
                title={`${a.original}\n${a.risk} Risk · ${a.confidence}% Evidence\n${new Date(a.created_at).toLocaleTimeString()}`}
              >
                <div className="bar-track">
                  <div
                    className={`bar-fill ${a.risk.toLowerCase()}`}
                    style={{
                      height: `${Math.max(20, Math.min(100, (a.ambiguities.length * 28) + 20))}%`
                    }}
                  />
                </div>
                <span className="bar-label">#{i + 1}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dash-empty-timeline">
            <BarChart3 size={24} />
            <b>No activity history yet</b>
            <p>Run analyses in the workspace to populate this activity timeline.</p>
            <button className="primary-action-btn" onClick={onOpenAnalyzer}>
              <span>Open Analyzer</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
