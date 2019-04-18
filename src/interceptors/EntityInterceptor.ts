import { Action, InterceptorInterface } from 'routing-controllers';

export class EntityInterceptor implements InterceptorInterface {

  intercept(_: Action, result: any) {
    return {
      result,
    };
  }

}
