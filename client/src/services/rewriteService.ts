import type { ContextMessage } from '../types';
const base = import.meta.env.VITE_API_URL || '/api';
export async function makeClearRewrite(message:string,context:ContextMessage[]) { const r=await fetch(`${base}/rewrite`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,context})}); if(!r.ok)throw new Error('Could not create a clear rewrite.'); return r.json(); }
