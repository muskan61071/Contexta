import {Router} from 'express';import {clarifications} from '../controllers/clarificationController.js';import {validateBody} from '../middleware/validate.js';import {analysisRequestSchema} from '../schemas/analysisSchema.js';
const router=Router();router.post('/',validateBody(analysisRequestSchema),clarifications);export default router;
