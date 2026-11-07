import { callNlp } from './nlpClient.js';
export const generateClarifications = (input) => callNlp('/api/clarifications', input);
