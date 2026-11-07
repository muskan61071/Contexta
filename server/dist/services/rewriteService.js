import { callNlp } from './nlpClient.js';
export const generateRewrite = (input) => callNlp('/api/rewrite', input);
