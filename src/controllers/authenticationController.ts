import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IDENTIFIER } from '../constants/identifier';
import { IAuthenticationService } from '../services/authenticationService';
import { ILoggerUtil } from '../utils/loggerUtil';
import container from '../config/diConfig';

export interface IAuthController {
  authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void>
}

@injectable()
export class AuthController implements IAuthController {

  private authService;
  private logger;

  constructor (
    @inject(IDENTIFIER.AuthenticationService) authService: IAuthenticationService,
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil
  ) {
    this.authService = authService;
    this.logger = logger;
  }

  async authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = container.get<ILoggerUtil>(IDENTIFIER.Logger);
    try { 
      const authService = container.get<IAuthenticationService>(IDENTIFIER.AuthenticationService);
      const user = await authService.authenticate(req.body);
      
      res.send({ 
        status: 200,
        message: 'User authenticated Successfully', 
        data: user
      });
    } catch (err) {
      logger.error(`err in controller - AuthController - authenticateUser - ${err}`);
      next(err)
    }
  }
   
}