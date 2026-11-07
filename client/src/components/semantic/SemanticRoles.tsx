import type {Relationship} from '../../types/relationship';
export default function SemanticRoles({items}:{items:Relationship[]}){return <dl>{items.map((x,i)=><div key={i}><dt>{x.role}</dt><dd>{x.value}</dd></div>)}</dl>}
