import type {Message} from '../../types/message';
import MessageBubble from './MessageBubble';
export default function MessageList({messages,currentId}:{messages:Message[];currentId?:string}){return <div className="message-list">{messages.map(m=><MessageBubble key={m.id} message={m} highlight={m.id===currentId}/>)}</div>}
