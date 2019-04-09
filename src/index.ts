import express from 'express';
import controllers from './controllers';

const app: express.Application = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use('/api', controllers);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});