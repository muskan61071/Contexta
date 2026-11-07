import type {Relationship} from '../../types/relationship';
export default function RelationshipCard({relationship}:{relationship:Relationship}){return <div className="relationship-card"><span>{relationship.role}</span><b>{relationship.value}</b></div>}
