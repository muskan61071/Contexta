import type { ContextMessage } from '../types';
const base = import.meta.env.VITE_API_URL || '/api';
export async function getClarifications(message:string,context:ContextMessage[]) { const r=await fetch(`${base}/clarifications`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,context})}); if(!r.ok)throw new Error('Could not generate clarification questions.'); return r.json() as Promise<string[]>; }
