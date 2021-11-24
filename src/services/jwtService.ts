import { injectable } from "inversify";
import jwt from 'jsonwebtoken';
import CONFIG from '../config/envConfig';

export interface IJWTService {
  sign(authPayload: IAuthPayload): Promise<IJWT>;
  verify(token: string);
}

export interface IJWT {
  token: string
}

export interface IAuthPayload {
  first_name: string,
  last_name: string,
  email: string,
  _id: string
}

@injectable()
export class JWTService implements IJWTService {

  public async sign(authPayload: IAuthPayload): Promise<IJWT> {
    const payloads = {
      expiresIn: CONFIG.JWT_EXPIRY,
      data: authPayload,
    };
    const token = jwt.sign(payloads, CONFIG.JWT_SECRET);
    return { token: token };
  }

  public async verify(token: string) {
    return jwt.verify(token, CONFIG.JWT_SECRET);
  }
}