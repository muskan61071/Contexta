import { Router } from 'express';
import { contextAnalysis } from '../controllers/contextController.js';
import { validateBody } from '../middleware/validate.js';
import { analysisRequestSchema } from '../schemas/analysisSchema.js';
const router = Router();
router.post('/analyze', validateBody(analysisRequestSchema), contextAnalysis);
export default router;
