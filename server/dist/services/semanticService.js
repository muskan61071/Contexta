import { callNlp } from './nlpClient.js';
export async function extractSemantics(input) { const result = await callNlp('/api/semantic', input); return result.relationships; }
