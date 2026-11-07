import 'dotenv/config';
const port = Number(process.env.PORT || 5000), timeout = Number(process.env.REQUEST_TIMEOUT_MS || 15000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('PORT must be a valid port number');
export const env = { port, clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', nlpUrl: (process.env.NLP_ENGINE_URL || 'http://localhost:8000').replace(/\/$/, ''), timeoutMs: Number.isFinite(timeout) ? timeout : 15000 };
