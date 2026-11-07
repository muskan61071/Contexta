export type ContextMessage = {
  id: string;
  speaker: string;
  text: string;
  timestamp?: string;
  roleHint?: string;
};

export type AmbiguityKind =
  | 'Unclear reference'
  | 'Word with more than one meaning'
  | 'Sentence that can be grouped in different ways'
  | 'Missing details'
  | string;

export type Ambiguity = {
  expression: string;
  kind?: AmbiguityKind;
  type: string;
  possible_meanings?: string[];
  evidence_message?: string | null;
  has_enough_evidence?: boolean;
  clarification_question?: string | null;
  suggested_meaning?: string | null;
  candidates: string[];
  resolved: string | null;
  confidence: number;
  reason: string;
};

export type SemanticNode = {
  id: string;
  label: string;
  role: string;
  type: 'action' | 'person' | 'object' | 'modifier' | string;
};

export type SemanticEdge = {
  source: string;
  target: string;
  label: string;
};

export type SemanticGraph = {
  nodes: SemanticNode[];
  edges: SemanticEdge[];
};

export type ClarificationDetail = {
  id: string;
  expression: string;
  question: string;
  type: string;
  options: string[];
};

export type ReplacementItem = {
  original: string;
  resolved: string;
  reason?: string;
};

export type Interpretation = {
  meaning: string;
  confidence: number;
  support: string[];
  conflict: string[];
};

export type ContextQuote = {
  text: string;
  reason: string;
};

export type Relationship = {
  role: string;
  value: string;
};

export type Analysis = {
  id: string;
  original: string;
  confidence: number;
  confidence_level: 'High' | 'Medium' | 'Low' | string;
  risk: 'High' | 'Medium' | 'Low' | string;
  risk_score?: number;
  risk_reasons: string[];
  ambiguities: Ambiguity[];
  context_used: ContextQuote[];
  interpretations: Interpretation[];
  intent: string | null;
  rewrite: string | null;
  replacement_map?: ReplacementItem[];
  clarifications: string[];
  clarification_details?: ClarificationDetail[];
  relationships: Relationship[];
  semantic_graph?: SemanticGraph;
  explanation: string;
  pipeline: string[];
  created_at: string;
};
