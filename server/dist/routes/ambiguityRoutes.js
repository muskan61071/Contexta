import { Router } from 'express';
import { interpretations, references } from '../controllers/ambiguityController.js';
import { validateBody } from '../middleware/validate.js';
import { analysisRequestSchema } from '../schemas/analysisSchema.js';
const router = Router();
router.post('/resolve', validateBody(analysisRequestSchema), references);
router.post('/interpretations', validateBody(analysisRequestSchema), interpretations);
export default router;
