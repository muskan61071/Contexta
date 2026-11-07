import React, { useState } from 'react';
import { User, Zap, Box, Send, Clock, MapPin, Wrench, Info, ArrowRight } from 'lucide-react';
import type { Relationship, SemanticGraph } from '../../types';

interface Props {
  relationships: Relationship[];
  graph?: SemanticGraph;
  title?: string;
  subtitle?: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  'Person / entity': <User size={15} />,
  'Agent': <User size={15} />,
  'Action': <Zap size={15} />,
  'Object': <Box size={15} />,
  'Recipient': <Send size={15} />,
  'Recipient / other': <Send size={15} />,
  'Time': <Clock size={15} />,
  'Location': <MapPin size={15} />,
  'Instrument / Modifier': <Wrench size={15} />
};

const roleColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  'Person / entity': { bg: 'rgba(99, 102, 241, 0.08)', border: '#818cf8', text: '#4338ca', badge: '#4f46e5' },
  'Agent': { bg: 'rgba(99, 102, 241, 0.08)', border: '#818cf8', text: '#4338ca', badge: '#4f46e5' },
  'Action': { bg: 'rgba(239, 68, 68, 0.08)', border: '#f87171', text: '#b91c1c', badge: '#dc2626' },
  'Object': { bg: 'rgba(16, 185, 129, 0.08)', border: '#34d399', text: '#047857', badge: '#059669' },
  'Recipient': { bg: 'rgba(245, 158, 11, 0.08)', border: '#fbbf24', text: '#b45309', badge: '#d97706' },
  'Recipient / other': { bg: 'rgba(245, 158, 11, 0.08)', border: '#fbbf24', text: '#b45309', badge: '#d97706' },
  'Time': { bg: 'rgba(14, 165, 233, 0.08)', border: '#38bdf8', text: '#0369a1', badge: '#0284c7' },
  'Location': { bg: 'rgba(168, 85, 247, 0.08)', border: '#c084fc', text: '#7e22ce', badge: '#9333ea' },
  'Instrument / Modifier': { bg: 'rgba(234, 88, 12, 0.08)', border: '#fb923c', text: '#c2410c', badge: '#ea580c' }
};

export default function SemanticRelationshipGraph({ relationships, graph, title, subtitle }: Props) {
  const [activeRole, setActiveRole] = useState<string | null>(null);

  if (!relationships.length) {
    return (
      <div className="semantic-graph-empty">
        <Info size={18} />
        <div>
          <b>No semantic relationships extracted</b>
          <span>Provide a sentence with actions, entities, and objects to generate a semantic frame.</span>
        </div>
      </div>
    );
  }

  // Derive visual node positions for graph
  const nodes = relationships.map((r, i) => {
    const total = relationships.length;
    const x = total === 1 ? 250 : 70 + (i * (420 / Math.max(1, total - 1)));
    const y = i % 2 === 0 ? 75 : 125;
    return {
      ...r,
      x,
      y,
      color: roleColors[r.role] || roleColors['Object']
    };
  });

  return (
    <div className="semantic-graph-container">
      {title && (
        <div className="graph-header">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <span className="graph-badge">{relationships.length} Thematic Roles</span>
        </div>
      )}

      {/* SVG Canvas for Visual Relationship Flow */}
      <div className="graph-canvas-wrapper">
        <svg className="graph-svg" viewBox="0 0 540 200" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#818cf8" />
            </marker>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Connect sequential nodes with curved spline arrows */}
          {nodes.map((node, i) => {
            if (i === nodes.length - 1) return null;
            const next = nodes[i + 1];
            const mx = (node.x + next.x) / 2;
            const my = (node.y + next.y) / 2 + (i % 2 === 0 ? -20 : 20);
            return (
              <g key={`edge-${i}`}>
                <path
                  d={`M ${node.x} ${node.y} Q ${mx} ${my} ${next.x} ${next.y}`}
                  fill="none"
                  stroke="url(#edgeGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="5,3"
                  markerEnd="url(#arrowhead)"
                  className="graph-flow-edge"
                />
              </g>
            );
          })}

          {/* Render interactive nodes */}
          {nodes.map((n, i) => {
            const isHovered = activeRole === n.role;
            return (
              <g
                key={`node-${i}`}
                transform={`translate(${n.x}, ${n.y})`}
                className={`graph-node-group ${isHovered ? 'active' : ''}`}
                onMouseEnter={() => setActiveRole(n.role)}
                onMouseLeave={() => setActiveRole(null)}
              >
                {/* Node outer glow */}
                <rect
                  x="-65"
                  y="-26"
                  width="130"
                  height="52"
                  rx="10"
                  fill={n.color.bg}
                  stroke={n.color.border}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                  className="node-rect"
                />
                {/* Role text */}
                <text
                  x="0"
                  y="-6"
                  textAnchor="middle"
                  fill={n.color.badge}
                  fontSize="9"
                  fontFamily="'DM Mono', monospace"
                  fontWeight="600"
                  letterSpacing="0.5"
                >
                  {n.role.toUpperCase()}
                </text>
                {/* Entity / value text */}
                <text
                  x="0"
                  y="13"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="11"
                  fontFamily="'Manrope', sans-serif"
                  fontWeight="700"
                >
                  {n.value.length > 14 ? n.value.slice(0, 13) + '…' : n.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Grid of Semantic Role Cards */}
      <div className="semantic-role-grid">
        {relationships.map((r, i) => {
          const cfg = roleColors[r.role] || roleColors['Object'];
          const icon = roleIcons[r.role] || <Box size={14} />;
          return (
            <div
              key={i}
              className={`semantic-role-card ${activeRole === r.role ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveRole(r.role)}
              onMouseLeave={() => setActiveRole(null)}
              style={{
                borderLeft: `3px solid ${cfg.border}`,
                backgroundColor: activeRole === r.role ? cfg.bg : 'var(--card-bg, #ffffff)'
              }}
            >
              <div className="role-top">
                <span className="role-icon-wrap" style={{ color: cfg.badge }}>
                  {icon}
                </span>
                <span className="role-tag" style={{ color: cfg.badge }}>
                  {r.role}
                </span>
              </div>
              <b className="role-val">{r.value}</b>
            </div>
          );
        })}
      </div>

      {/* Explainability note */}
      <div className="semantic-explanation-strip">
        <Info size={14} />
        <span>
          Semantic roles extract <em>who does what to whom</em>. In subsequent messages, ambiguous pronouns like <strong>“it”</strong> align with Objects and <strong>“her” / “him”</strong> align with Recipients.
        </span>
      </div>
    </div>
  );
}
