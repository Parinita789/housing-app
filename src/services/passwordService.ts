import { injectable } from "inversify";
import bcrypt from 'bcrypt';
import CONFIG from '../config/envConfig';

export interface IPasswordService {
  getPasswordHash(password: string): string;
  compareHashWithPassword(passwordHash: string, password: string): boolean;
}

@injectable()
export class PasswordService implements IPasswordService {

  readonly saltRounds: number = CONFIG.SALT_ROUNDS;

  public getPasswordHash(password: string): string {
    return bcrypt.hash(password, this.saltRounds)
  }

  public compareHashWithPassword(passwordHash: string, password: string): boolean {
    return bcrypt.compare(password, passwordHash)
  }
}