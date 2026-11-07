export default function LoadingState({label='Analyzing message…'}:{label?:string}){return <div role="status" className="loading-state"><span className="spinner"/>{label}</div>}
