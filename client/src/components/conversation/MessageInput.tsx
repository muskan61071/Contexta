type Props={value:string,onChange:(v:string)=>void,placeholder?:string};
export default function MessageInput({value,onChange,placeholder='Type a message…'}:Props){return <textarea className="message-input" value={value} onChange={e=>onChange(e.target.value)} maxLength={5000} placeholder={placeholder}/>}
