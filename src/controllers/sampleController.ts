import express from 'express';

let router = express.Router();

router.get('/', function (req, res) {
  res.send({
    data: 'sample',
  })
});

export default router;