import express from 'express';
import apiRouter from '../api/index';

const app: express.Application = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use('/api',apiRouter);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});