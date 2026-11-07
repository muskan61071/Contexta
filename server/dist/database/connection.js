import { env } from '../config/environment.js';
export async function checkDatabaseService() { try {
    const r = await fetch(`${env.nlpUrl}/api/health`);
    return r.ok;
}
catch {
    return false;
} }
