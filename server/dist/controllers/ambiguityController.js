import { resolveReferences, generateInterpretations } from '../services/ambiguityService.js';
export async function references(req, res, next) { try {
    res.json(await resolveReferences(req.body));
}
catch (e) {
    next(e);
} }
export async function interpretations(req, res, next) { try {
    res.json(await generateInterpretations(req.body));
}
catch (e) {
    next(e);
} }
