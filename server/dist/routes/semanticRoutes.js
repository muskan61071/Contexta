import { Router } from 'express';
import { semantics } from '../controllers/semanticController.js';
import { validateBody } from '../middleware/validate.js';
import { analysisRequestSchema } from '../schemas/analysisSchema.js';
const router = Router();
router.post('/', validateBody(analysisRequestSchema), semantics);
export default router;
