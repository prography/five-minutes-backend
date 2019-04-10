import express from 'express';
import SampleRoutes from './SampleRoutes';

const router = express.Router();

router.use('/samples', SampleRoutes);

export default router;
