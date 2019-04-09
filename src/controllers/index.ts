import express from 'express';
import sampleController from './sampleController';

let router = express.Router();

router.use('/samples', sampleController);

export default router;