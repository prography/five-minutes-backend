import * as Sentry from '@sentry/node';
import { HttpError } from 'routing-controllers';
import { QueryFailedError } from 'typeorm';
export class ErrorManager {

  // TODO: 센트리에 로깅 할 필요가 없는 에러 필터 정리, 로그인 실패, 권한 없음 등등
  public static ignoreFilter(event: Sentry.Event) {
    return true;
  }

  // TODO: 에러를 메시지로 파싱하는 객체, 에러 별로 다른 내용을 잘 보여줄 수 있도록 수정
  public static parse(error: HttpError | QueryFailedError | Error) {
    if (error instanceof HttpError) {
      return {
        httpCode: error.httpCode || 500,
        name: error.name,
        message: error.message || 'something is wrong',
      };
    }
    if (error instanceof QueryFailedError) {
      return {
        httpCode: 400,
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    return {
      httpCode: 500,
      name: error.name,
      message: error.message || 'something is wrong',
      trace: error.stack,
    };
  }
}
