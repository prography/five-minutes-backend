import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

export class AuthHelper {

  static generate(email: string, password: string) {
    const privateKey: string = process.env.JWT_SECRET || '';
    return jsonwebtoken.sign({ email, password: AuthHelper.hash(password) }, privateKey);
  }

  static extract(token: string) {
    return jsonwebtoken.decode(token);
  }

  static hash(rawText: string) {
    const hasher = crypto.createHash('RSA-SHA256');
    hasher.update(rawText);
    return hasher.digest('hex');
  }
}
