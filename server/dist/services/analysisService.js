import { callNlp } from './nlpClient.js';
export const runAnalysis = (input) => callNlp('/api/analyze', input);
