import { callNlp } from './nlpClient.js';
export const getHistory = () => callNlp('/api/history', undefined, 'GET');
export const deleteHistoryItem = (id) => callNlp(`/api/history/${encodeURIComponent(id)}`, undefined, 'DELETE');
export const clearHistory = () => callNlp('/api/history', undefined, 'DELETE');
