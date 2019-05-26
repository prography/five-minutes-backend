import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { ObjectManager } from '../utils/ObjectManager';

@Interceptor()
export class AuthDeletionInterceptor implements InterceptorInterface {

  intercept(_: Action, result: any) {
    return ObjectManager.deleteValuesByKeys(result, ['password']);
  }

}
