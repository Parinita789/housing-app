import { inject, injectable } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { IUserDocument } from '../models/userModel';
import { IUserService } from '../services/userService';
import { AuthorizationError } from '../utils/errorUtil';
import { IPasswordService } from './passwordService';
import { IJWT, IJWTService } from './jwtService';

export interface IAuthenticationService {
  authenticate(loginData: ILoginData): Promise<IJWT>
}

interface ILoginData {
  email: string,
  password: string
}

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private userService;
  private passwordService;
  private jwtService;

  constructor(
    @inject(IDENTIFIER.UserService) userService: IUserService,
    @inject(IDENTIFIER.PasswordService) passwordService: IPasswordService,
    @inject(IDENTIFIER.JWTService) jwtService: IJWTService
  ) {
    this.userService = userService;
    this.passwordService = passwordService;
    this.jwtService = jwtService;
  }

  public async authenticate(loginData: ILoginData): Promise<IJWT> {
    const query: object = { email: loginData.email };
    const user: IUserDocument = await this.userService.findUserByEmail(query);
    if (!user) {
      throw new AuthorizationError('User Does Not Exist!')
    } 
    
    const isPasswordMatch: Boolean = await this.passwordService.compareHashWithPassword(user.password, loginData.password);
    if (!isPasswordMatch) {
      throw new AuthorizationError('Username or password is incorrect!')
    } 
    const authPayload = {
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user._id.toString(),
      email: user.email
    }
    const token = await this.jwtService.sign(authPayload);
    return token;
  }
}