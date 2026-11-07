import { Router } from 'express';
import { clearHistory, deleteHistory, listHistory } from '../controllers/historyController.js';
const router = Router();
router.get('/', listHistory);
router.delete('/', clearHistory);
router.delete('/:id', deleteHistory);
export default router;
