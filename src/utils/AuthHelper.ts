import jsonwebtoken from 'jsonwebtoken';

export class AuthHelper {
  encodeToken(email: string, password: string) {
    const privateKey: string = process.env.JWT_SECRET || '';
    return jsonwebtoken.sign({ email, password }, privateKey);
  }
  decodeToken(token: string) {
    return jsonwebtoken.decode(token);
  }
}
