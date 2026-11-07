import { extractSemantics } from '../services/semanticService.js';
export async function semantics(req, res, next) { try {
    res.json({ relationships: await extractSemantics(req.body) });
}
catch (e) {
    next(e);
} }
