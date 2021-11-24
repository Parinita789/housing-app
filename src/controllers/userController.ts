import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IDENTIFIER } from '../constants/identifier';
import { IUserService } from '../services/userService';
import { ILoggerUtil } from '../utils/loggerUtil';
import container from '../config/diConfig';

export interface IUserController {
  registerUser(req: Request, res: Response, next: NextFunction): Promise<void>
}

@injectable()
export class UserController implements IUserController {
  private userService;
  private logger;

  constructor (
    @inject(IDENTIFIER.UserService) userService: IUserService,
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil
  ) {
    this.userService = userService;
    this.logger = logger;
  }
  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = container.get<ILoggerUtil>(IDENTIFIER.Logger);
    try { 
      const userService = container.get<IUserService>(IDENTIFIER.UserService);
      await userService.createUser(req.body);

      res.send({ 
        status: 200,
        message: 'User Created Successfully.'
      });
    } catch (err) {
      logger.error(`err in controller - UserController - registerUser - ${err}`);
      next(err)
    }
  }

  async wishlistProperty(req, res: Response, next: NextFunction): Promise<void> {
    const logger = container.get<ILoggerUtil>(IDENTIFIER.Logger);
    try { 
      const userService = container.get<IUserService>(IDENTIFIER.UserService);
      await userService.wishlistProperty(req.body, req.context.data.user_id);

      res.send({ 
        status: 200,
        message: 'Property Saved in Favorites Successfully.'
      });
    } catch (err) {
      logger.error(`err in controller - WishlistPropertyController - wishlistProperty - ${err}`);
      next(err)
    }
  }

  async getwishlistProperty(req, res: Response, next: NextFunction): Promise<void> {
    const logger = container.get<ILoggerUtil>(IDENTIFIER.Logger);
    try { 
      const userService = container.get<IUserService>(IDENTIFIER.UserService);
      const page = req?.query?.page ? Number(req.query.page) : 0;
      const limit = req?.query?.limit ? Number(req.query.limit) : 10;
      const data = await userService.getWishlistProperty(req.context.data.user_id, page, limit);

      res.send({ 
        status: 200,
        message: 'Favorite Properties Fetched Successfully', 
        data: data
      });
    } catch (err) {
      logger.error(`err in controller - WishlistPropertyController - getwishlistProperty - ${err}`);
      next(err)
    }
  }
   
}