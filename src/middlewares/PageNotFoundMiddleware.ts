import express from 'express';
import { ExpressMiddlewareInterface, Middleware, NotFoundError } from 'routing-controllers';

/**
 * 컨트롤러를 지나쳤지만, 에러도 안나고 응답도 없는 경우, 404 에러 발생
 */

@Middleware({ type: 'after' })
export class PageNotFoundMiddleware implements ExpressMiddlewareInterface {
  use(_: any, res: express.Response, __: (err: any) => any) {
    if (!res.headersSent) {
      throw new NotFoundError('404 not found');
    }
  }
}
