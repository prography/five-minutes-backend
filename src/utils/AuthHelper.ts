import jsonwebtoken from 'jsonwebtoken';
import { Codec } from './Codec';

export class AuthHelper {
  static generate(email: string, password: string) {
    const privateKey: string = process.env.JWT_SECRET || '';
    return jsonwebtoken.sign({ email, password: Codec.hash(password) }, privateKey);
  }
  static extract(token: string) {
    return jsonwebtoken.decode(token);
  }
}
