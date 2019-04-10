import express from 'express';
import { SampleController } from '../controllers/sampleController';

const router = express.Router();

const sampleController = new SampleController();

router.get('/', sampleController.create);
router.get('/:sample', sampleController.get);

export default router;
