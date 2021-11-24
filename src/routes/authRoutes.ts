import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { IValidateMiddleware } from '../middlewares/validateMiddleware';
import { IAuthController } from '../controllers/authenticationController';
import { authSchema } from '../schemas/authSchema';

export interface IAuthRoutes {
  initializeUserRoutes(router: Router): void
}

@injectable()
export class AuthRoutes implements IAuthRoutes {

  private validateMiddleware;
  private authController;
  
  constructor (
    @inject(IDENTIFIER.ValidateMiddleware) validateMiddleware: IValidateMiddleware,
    @inject(IDENTIFIER.AuthController) authController: IAuthController,
  ) {
    this.validateMiddleware = validateMiddleware;
    this.authController = authController;
  }

  public initializeUserRoutes(router: Router): void {
    router.post('/authenticate', this.validateMiddleware.validate(authSchema), this.authController.authenticateUser)
  }
}

