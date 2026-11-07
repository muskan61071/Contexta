import { callNlp } from './nlpClient.js';
export const resolveReferences = (input) => callNlp('/api/references/resolve', input);
export const generateInterpretations = (input) => callNlp('/api/interpretations', input);
