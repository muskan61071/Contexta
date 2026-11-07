import type {Analysis} from '../../types';
import HistoryCard from './HistoryCard';
export default function HistoryList({items,onDelete,onOpen}:{items:Analysis[];onDelete:(id:string)=>void;onOpen:(item:Analysis)=>void}){return <div className="history-list">{items.map(item=><HistoryCard key={item.id} item={item} onDelete={()=>onDelete(item.id)} onOpen={()=>onOpen(item)}/>)}</div>}
