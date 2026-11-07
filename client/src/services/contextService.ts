import type { ContextMessage } from '../types';
const base = import.meta.env.VITE_API_URL || '/api';
export async function analyzeContext(message: string, context: ContextMessage[]) {
  const response = await fetch(`${base}/context/analyze`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message,context}) });
  if (!response.ok) throw new Error('Context analysis failed.'); return response.json();
}
