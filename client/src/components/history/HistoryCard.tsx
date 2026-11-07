import type {Analysis} from '../../types';
export default function HistoryCard({item,onDelete,onOpen}:{item:Analysis;onDelete:()=>void;onOpen:()=>void}){return <article className="history-row"><button onClick={onOpen}>{item.original}</button><span>{item.risk} risk · {item.confidence_level}</span><button onClick={onDelete}>Delete</button></article>}
