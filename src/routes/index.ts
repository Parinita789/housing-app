import { Router, Express } from 'express';
import { IPropertyRoutes } from './propertyRoutes';
import { IAuthRoutes } from './authRoutes';
import { IUserRoutes } from './userRoutes';
import { IDENTIFIER } from '../constants/identifier';
import { inject, injectable } from 'inversify';

const router: Router = Router();

export interface IRoutes {
  initializeRoutes(app: Express): void
}

@injectable()
export class Routes implements IRoutes {
  private propertyRoutes;
  private userRoutes;
  private authRoutes;

  constructor (
    @inject(IDENTIFIER.PropertyRoutes) propertyRoutes: IPropertyRoutes,
    @inject(IDENTIFIER.UserRoutes) userRoutes: IUserRoutes,
    @inject(IDENTIFIER.AuthRoutes) authRoutes: IAuthRoutes,
  ) {
    this.propertyRoutes = propertyRoutes;
    this.authRoutes = authRoutes;
    this.userRoutes = userRoutes;
  }

  public initializeRoutes(app: Express): void {
    app.use('/api/v1', router);
    this.authRoutes.initializeUserRoutes(router);
    this.userRoutes.initializeUserRoutes(router);
    this.propertyRoutes.initializePropertyRoutes(router);
  }
}
  