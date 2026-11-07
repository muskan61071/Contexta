import { generateRewrite } from '../services/rewriteService.js';
export async function rewrite(req, res, next) { try {
    res.json(await generateRewrite(req.body));
}
catch (e) {
    next(e);
} }
