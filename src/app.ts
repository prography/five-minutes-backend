import * as Sentry from '@sentry/node';
import express from 'express';
import { Action, useExpressServer } from 'routing-controllers';
import { UserService } from './services/UserService';
import { AuthHelper } from './utils/AuthHelper';

// TODO: Sentry 401, 400, 404, 403, 405, 422 코드는 에러 로깅 하지 않도록 필터 생성
Sentry.init({ dsn: process.env.SENTRY_DSN });

const app: express.Application = express();

app.use(Sentry.Handlers.requestHandler());

useExpressServer(app, {
  routePrefix: 'api',
  defaultErrorHandler: false,
  authorizationChecker: async (action: Action) => {
    // headers 에서 bearer token 추출
    const bearerToken = <string>action.request.headers['Authorization'];
    // bearer token이 없는 경우 인증 실패
    if (!bearerToken) return false;
    return true;
  },
  currentUserChecker: async (action: Action) => {
    // bearer token에서 사용자 정보 가져옴
    const token = action.request.headers['Authorization'].replace(/Bearer\s/, '');
    const authModel = AuthHelper.extract(token);
    // 토큰 파싱이 불가능한 경우(오염된 토큰)
    if (!authModel) return false;
    const user = await new UserService().getUserByToken(token);
    // User가 없는 경우, token으로 찾을 수 없는 유저
    if (!user) return false;
    // 모든 에러 체크를 통과하면 request에 user 추가
    return user;
  },
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
