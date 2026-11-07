import { Router } from 'express';
import { rewrite } from '../controllers/rewriteController.js';
import { validateBody } from '../middleware/validate.js';
import { analysisRequestSchema } from '../schemas/analysisSchema.js';
const router = Router();
router.post('/', validateBody(analysisRequestSchema), rewrite);
export default router;
