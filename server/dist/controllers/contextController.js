import { analyzeContext } from '../services/contextService.js';
export async function contextAnalysis(req, res, next) { try {
    res.json(await analyzeContext(req.body));
}
catch (e) {
    next(e);
} }
