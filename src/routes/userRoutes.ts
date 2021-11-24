import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { IValidateMiddleware } from '../middlewares/validateMiddleware';
import { IUserController } from '../controllers/userController';
import { userSchema } from '../schemas/userSchema';

export interface IUserRoutes {
  initializeUserRoutes(router: Router): void
}

@injectable()
export class UserRoutes implements IUserRoutes {

  private validateMiddleware;
  private userController;
  
  constructor (
    @inject(IDENTIFIER.ValidateMiddleware) validateMiddleware: IValidateMiddleware,
    @inject(IDENTIFIER.UserController) userController: IUserController,
  ) {
    this.validateMiddleware = validateMiddleware;
    this.userController = userController;
  }

  public initializeUserRoutes(router: Router): void {
    router.post('/user', this.validateMiddleware.validate(userSchema), this.userController.registerUser)
  }
}


