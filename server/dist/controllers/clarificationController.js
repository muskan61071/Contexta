import { generateClarifications } from '../services/clarificationService.js';
export async function clarifications(req, res, next) { try {
    res.json(await generateClarifications(req.body));
}
catch (e) {
    next(e);
} }
