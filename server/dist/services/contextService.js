import { callNlp } from './nlpClient.js';
export const analyzeContext = (input) => callNlp('/api/context/analyze', input);
