export default function RewriteActions({text}:{text:string}){return <button className="copy-button" onClick={()=>navigator.clipboard?.writeText(text)}>Copy clear version</button>}
