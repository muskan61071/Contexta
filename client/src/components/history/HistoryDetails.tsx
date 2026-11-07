import type {Analysis} from '../../types';
export default function HistoryDetails({item}:{item:Analysis}){return <article><h2>{item.original}</h2><p>{item.intent||item.clarifications.join(' ')}</p><small>{item.confidence_level} evidence · {item.risk} risk</small></article>}
