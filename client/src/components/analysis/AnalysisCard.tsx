import type {Analysis} from '../../types';
export default function AnalysisCard({analysis}:{analysis:Analysis}){return <article className="analysis-card"><b>{analysis.original}</b><p>{analysis.intent||analysis.clarifications[0]||'No clarification needed.'}</p><small>{analysis.confidence_level} evidence · {analysis.risk} risk</small></article>}
