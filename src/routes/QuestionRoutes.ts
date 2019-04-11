import express from 'express';
import { QuestionController } from '../controllers/QuestionController';

const router = express.Router();

const questionController = new QuestionController();

router.get('/', questionController.get);
router.get('/:question', questionController.get);
router.post('/', questionController.create);

export default router;
