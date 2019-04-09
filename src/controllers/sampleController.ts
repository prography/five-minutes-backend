import express from 'express';

const router = express.Router();

router.get('/', (_: express.Request, res: express.Response) => {
  res.send({
    data: 'sample',
  });
});

export default router;
