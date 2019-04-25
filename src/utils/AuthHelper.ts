import jsonwebtoken from 'jsonwebtoken';

export default class AuthHelper {
  createToken(email: string, password: string) {
    const privKey: string|any = process.env.JWT_SECRET;
    return jsonwebtoken.sign({ email, password }, privKey);
  }
  getInfoFromToken(token: string) {
    return jsonwebtoken.decode(token);
  }
}
