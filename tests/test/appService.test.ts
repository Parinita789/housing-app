process.env.NODE_ENV = 'development';
process.env.PORT = '8000';

import { should } from 'chai';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { IDENTIFIER } from '../../src/constants/identifier';
import { LoggerUtil, ILoggerUtil } from '../../src/utils/loggerUtil';
import { IApplication, Application } from '../../src/services/appService';
import { IHttpService, HttpService } from '../../src/services/httpService';
import { IMongooseService, MongooseService } from '../../src/services/mongooseService';
import { IRedisService, RedisService } from '../../src/services/redisService';
import { IBasicMiddleware, BasicMiddleware } from '../../src/middlewares/basicMiddleware';
import { IErrorHandlerMiddleware, ErrorHandlerMiddleware } from '../../src/middlewares/errorHandlerMiddleware';
import { IRoutes, Routes } from '../../src/routes';
import { IAuthController, AuthController } from '../../src/controllers/authenticationController';
import { IPropertyController, PropertyController } from '../../src/controllers/propertyController';
import { IUserController, UserController } from '../../src/controllers/userController';
import { IAuthMiddleware, AuthMiddleware } from '../../src/middlewares/authMiddleware';
import { IValidateMiddleware, ValidateMiddleware } from '../../src/middlewares/validateMiddleware';
import { IPropertyRepository, PropertyRepository } from '../../src/repository/propertyRepository';
import { IUserRepository, UserRepository } from '../../src/repository/userRepository';
import { IAuthRoutes, AuthRoutes } from '../../src/routes/authRoutes';
import { IPropertyRoutes, PropertyRoutes } from '../../src/routes/propertyRoutes';
import { IUserRoutes, UserRoutes } from '../../src/routes/userRoutes';
import { IAuthenticationService, AuthenticationService } from '../../src/services/authenticationService';
import { IJWTService, JWTService } from '../../src/services/jwtService';
import { IPasswordService, PasswordService } from '../../src/services/passwordService';
import { IPropertyService, PropertyService } from '../../src/services/propertyService';
import { IUserService, UserService } from '../../src/services/userService';

describe('App Service test', () => {
  let appService: IApplication;
  let logger: ILoggerUtil;
  let mongooseService;
  let redisService;

  before(() => {
    const container = new Container();
    container.bind<IApplication>(IDENTIFIER.Application).to(Application).inSingletonScope();
    container.bind<IRedisService>(IDENTIFIER.RedisService).to(RedisService).inSingletonScope();
    container.bind<IHttpService>(IDENTIFIER.HttpService).to(HttpService).inSingletonScope();
    container.bind<IMongooseService>(IDENTIFIER.MongooseService).to(MongooseService).inSingletonScope();
    container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();
    container.bind<IBasicMiddleware>(IDENTIFIER.BasicMiddleware).to(BasicMiddleware).inSingletonScope();
    container.bind<IErrorHandlerMiddleware>(IDENTIFIER.ErrorHandlerMiddleware).to(ErrorHandlerMiddleware).inSingletonScope();
    container.bind<IRoutes>(IDENTIFIER.Routes).to(Routes).inSingletonScope();
    container.bind<IPropertyRoutes>(IDENTIFIER.PropertyRoutes).to(PropertyRoutes).inSingletonScope();
    container.bind<IAuthRoutes>(IDENTIFIER.AuthRoutes).to(AuthRoutes).inSingletonScope();
    container.bind<IUserRoutes>(IDENTIFIER.UserRoutes).to(UserRoutes).inSingletonScope();
    container.bind<IUserController>(IDENTIFIER.UserController).to(UserController).inSingletonScope();
    container.bind<IAuthController>(IDENTIFIER.AuthController).to(AuthController).inSingletonScope();
    container.bind<IPropertyController>(IDENTIFIER.PropertyController).to(PropertyController).inSingletonScope();
    container.bind<IPasswordService>(IDENTIFIER.PasswordService).to(PasswordService).inSingletonScope();
    container.bind<IJWTService>(IDENTIFIER.JWTService).to(JWTService).inSingletonScope();
    container.bind<IAuthenticationService>(IDENTIFIER.AuthenticationService).to(AuthenticationService).inSingletonScope();
    container.bind<IUserService>(IDENTIFIER.UserService).to(UserService).inSingletonScope();
    container.bind<IPropertyService>(IDENTIFIER.PropertyService).to(PropertyService).inSingletonScope();
    container.bind<IValidateMiddleware>(IDENTIFIER.ValidateMiddleware).to(ValidateMiddleware).inSingletonScope();
    container.bind<IAuthMiddleware>(IDENTIFIER.AuthorizationMiddleware).to(AuthMiddleware);
    container.bind<IUserRepository>(IDENTIFIER.UserRepository).to(UserRepository).inSingletonScope();
    container.bind<IPropertyRepository>(IDENTIFIER.PropertyRepository).to(PropertyRepository).inSingletonScope();

    appService = container.get(IDENTIFIER.Application);
    redisService = container.get(IDENTIFIER.RedisService);
    mongooseService = container.get(IDENTIFIER.MongooseService)
  });


  it('It should initialize the application', async () => {
    let appInitializes = await appService.initializeApplication();
    // should.exist(appInitializes);
    it('It should create mongoose connection', async (done) => {
       let dbConnection = await mongooseService.openConnection();
    //    should.exist(dbConnection);
       done()
    })

    it('It should create redis connection', async (done) => {
      let redisConnection = await redisService.initializeClient();
    //   should.exist(redisConnection);
      done()
    })

  });
});

