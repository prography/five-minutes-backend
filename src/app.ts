import * as Sentry from '@sentry/node';
import express from 'express';
import { useExpressServer } from 'routing-controllers';

// TODO: Sentry 401, 400, 404, 403, 405, 422 코드는 에러 로깅 하지 않도록 필터 생성
Sentry.init({ dsn: process.env.SENTRY_DSN });

const app: express.Application = express();

app.use(Sentry.Handlers.requestHandler());

useExpressServer(app, {
  defaultErrorHandler: false,
  // api route 연결
  controllers: [`${__dirname}/controllers/*.[tj]s`],
  middlewares: [`${__dirname}/middlewares/*.[tj]s`],
  interceptors: [`${__dirname}/interceptors/*[tj]s`],
});

app.use(Sentry.Handlers.errorHandler());

// TODO: 모든 에러 response 같은 형태로 보내주도록 추가
app.use((err: any, _: express.Request, res: express.Response, ___: express.NextFunction) => {
  if (!res.headersSent) {
    res.status(err.httpCode || 500).send(err.message || 'something is wrong');
  }
});

export default app;
