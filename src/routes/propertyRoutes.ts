import { inject, injectable } from 'inversify';
import { Router } from 'express';
import { IPropertyController } from '../controllers/propertyController';
import { getPropertySchema, propertySchema } from '../schemas/propertySchema';
import { IValidateMiddleware } from '../middlewares/validateMiddleware';
import { IAuthMiddleware } from '../middlewares/authMiddleware';
import { IDENTIFIER } from '../constants/identifier';
import { wishlistSchema } from '../schemas/wishlistPropertySchema';
import { IUserController } from '../controllers/userController';

export interface IPropertyRoutes {
  initializePropertyRoutes(router: Router): void
}

@injectable()
export class PropertyRoutes implements IPropertyRoutes {

  private validateMiddleware;
  private propertyController;
  private authMiddleware;
  private userController;

  constructor (
    @inject(IDENTIFIER.ValidateMiddleware) validateMiddleware: IValidateMiddleware,
    @inject(IDENTIFIER.AuthorizationMiddleware) authMiddleware: IAuthMiddleware,
    @inject(IDENTIFIER.PropertyController) propertyController: IPropertyController,
    @inject(IDENTIFIER.UserController) userController: IUserController,
  ) {
    this.validateMiddleware = validateMiddleware;
    this.authMiddleware = authMiddleware;
    this.propertyController = propertyController;
    this.userController = userController;
  }

  public initializePropertyRoutes(router: Router): void {
    router.post('/property', this.authMiddleware.authenticateUser, this.validateMiddleware.validate(propertySchema), this.propertyController.createProperty);
    router.get('/property', this.validateMiddleware.validateQuery(getPropertySchema), this.propertyController.getProperty); 
    router.post('/property/wishlist', this.authMiddleware.authenticateUser, this.validateMiddleware.validate(wishlistSchema), this.userController.wishlistProperty);
    router.get('/property/wishlist', this.authMiddleware.authenticateUser, this.userController.getwishlistProperty);
  }
}