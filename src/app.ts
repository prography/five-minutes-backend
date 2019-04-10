import express from 'express';
import routes from './routes';

const app: express.Application = express();

// TODO: Sentry 요청 초기화 코드 추가

// api 경로 연결
app.use('/', routes);

// 없는 경로의 경우 404 에러 페이지
app.use('*', (_: express.Request, res: express.Response) => {
  res.status(404).send('404 Not Found');
});

// TODO: Sentry 요청 종료 코드 추가

// TODO: 모든 에러 response 같은 형태로 보내주도록 추가

export default app;
