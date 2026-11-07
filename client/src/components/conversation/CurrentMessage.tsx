import MessageInput from './MessageInput';
export default function CurrentMessage({value,onChange}:{value:string;onChange:(v:string)=>void}){return <section><h2>Message to analyze</h2><MessageInput value={value} onChange={onChange}/></section>}
