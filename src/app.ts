import express from 'express';
import { useExpressServer } from 'routing-controllers';

const app: express.Application = express();

// TODO: Sentry 요청 초기화 코드 추가
// app.use();

useExpressServer(app, {
  // api route 연결
  controllers: [`${__dirname}/controllers/*.[tj]s`],
  middlewares: [`${__dirname}/middlewares/*.[tj]s`],
});

// TODO: Sentry 요청 종료 코드 추가
// app.use()

// TODO: 모든 에러 response 같은 형태로 보내주도록 추가

export default app;
