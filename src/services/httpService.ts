import express from 'express';
import { inject, injectable } from 'inversify';
import { Server, createServer } from 'http';
import CONFIG from '../config/envConfig';
import { IDENTIFIER } from '../constants/identifier';
import { IBasicMiddleware } from '../middlewares/basicMiddleware';
import { ILoggerUtil } from '../utils/loggerUtil';
import { InternalServerError } from '../utils/errorUtil';
import { IErrorHandlerMiddleware } from '../middlewares/errorHandlerMiddleware';
import { IRoutes } from '../routes';
 
export interface IHttpService {
  httpServer: Server;
  initializeServer(): Promise<void>;
}

@injectable()
export class HttpService implements IHttpService {
  private logger: ILoggerUtil;
  private basicMiddleware: IBasicMiddleware;
  private errorHandler: IErrorHandlerMiddleware;
  private appRoutes: IRoutes;
  public httpServer: Server;
  public app: express.Express;

  constructor(
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil,
    @inject(IDENTIFIER.BasicMiddleware) basicMiddleware: IBasicMiddleware,
    @inject(IDENTIFIER.ErrorHandlerMiddleware) errorHandler: IErrorHandlerMiddleware,
    @inject(IDENTIFIER.Routes) routes: IRoutes
  ) {
    this.logger = logger;
    this.basicMiddleware = basicMiddleware;
    this.errorHandler = errorHandler;
    this.appRoutes = routes;
  }
  
  public async initializeServer(): Promise<void> {
    this.app = express();

    this.httpServer = createServer(this.app);
    this.httpServer.setTimeout(CONFIG.SERVER_TIMEOUT);
    this.httpServer.keepAliveTimeout = CONFIG.KEEP_ALIVE_TIMEOUT; // ms

    this.basicMiddleware.initializeMiddlewares(this.app); // registering middlewares
    this.appRoutes.initializeRoutes(this.app); // registering routes
    this.errorHandler.handleError(this.app); // error handler middlware

    try {
      this.httpServer.listen(CONFIG.PORT, () => {
        return this.logger.info(`server is listening on ${CONFIG.PORT}`)
      });
    } catch (err) {
      this.logger.error(`err in httpService initializeServer - ${err}`);
      throw new InternalServerError(`err in initializeServer ${err}`);
    }
  }
}
