import express from 'express';

let router = express.Router();

router.get('/', function (req, res) {
    res.send('api')
});

export default router;