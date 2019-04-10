import app from './app';

const HOST: string = process.env.HOST || 'localhost';
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, HOST, () => {
  console.log('Server is listening on port 3000!');
});
