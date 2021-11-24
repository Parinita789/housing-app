import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/errorUtil';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IDENTIFIER } from '../constants/identifier';
import { IJWTService } from '../services/jwtService';
import container from '../config/diConfig';

export interface IAuthMiddleware {
  authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  private jwtService;
  private logger;

  constructor(
    @inject(IDENTIFIER.JWTService) jwtService: IJWTService,
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil
  ) {
    this.jwtService = jwtService;
    this.logger = logger;
  }

  public async authenticateUser(req, res: Response, next: NextFunction): Promise<void> {
    const logger = container.get<ILoggerUtil>(IDENTIFIER.Logger);
    try {
      const jwtService = container.get<IJWTService>(IDENTIFIER.JWTService);
      const token = req?.headers?.token as string;
      if (!token) {
        throw new AuthorizationError('Token is required.');
      }
      const decodedToken = await jwtService.verify(token);
      req.context = decodedToken;
      next();
    } catch (err) {
      logger.error(`err in middleware - authMiddleware - ${err}`);
      next(err);
    }
  }
}