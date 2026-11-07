import type { ContextMessage } from '../types';
const base = import.meta.env.VITE_API_URL || '/api';
export async function resolveReferences(message:string,context:ContextMessage[]) { const r=await fetch(`${base}/references/resolve`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,context})}); if(!r.ok)throw new Error('Reference analysis failed.'); return r.json(); }
