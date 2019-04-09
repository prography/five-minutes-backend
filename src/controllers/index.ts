import express from 'express';
import sampleController from './sampleController';

const router = express.Router();

router.use('/samples', sampleController);

export default router;
