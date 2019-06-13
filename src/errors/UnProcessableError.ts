import { HttpError } from 'routing-controllers';

export class UnProcessableError extends HttpError {
  constructor(message: string) {
    super(422, message || 'request body is unprocessable');
  }
}
