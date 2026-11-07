import { runAnalysis } from '../services/analysisService.js';
export async function analyzeMessage(req, res, next) { try {
    res.json(await runAnalysis(req.body));
}
catch (e) {
    next(e);
} }
export async function previewMessage(req, res, next) { try {
    const { callNlp } = await import('../services/nlpClient.js');
    res.json(await callNlp('/api/preview', req.body));
}
catch (e) {
    next(e);
} }
