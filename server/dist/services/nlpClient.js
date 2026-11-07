import { env } from '../config/environment.js';
export async function callNlp(path, body, method = 'POST') { const controller = new AbortController(), timer = setTimeout(() => controller.abort(), env.timeoutMs); try {
    const response = await fetch(`${env.nlpUrl}${path}`, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, signal: controller.signal });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(typeof data.detail === 'string' ? data.detail : 'The analysis service rejected the request.');
        error.status = response.status;
        throw error;
    }
    return data;
}
catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new Error('Analysis timed out. Please try again.');
        timeoutError.status = 504;
        throw timeoutError;
    }
    throw error;
}
finally {
    clearTimeout(timer);
} }
