import type {Message} from '../../types/message';
export default function ContextTimeline({messages}:{messages:Message[]}){return <ol className="context-timeline">{messages.map(m=><li key={m.id}><b>{m.speaker}</b><span>{m.text}</span></li>)}</ol>}
