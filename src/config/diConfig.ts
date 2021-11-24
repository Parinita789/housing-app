import 'reflect-metadata';
import { Container } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { RedisService, IRedisService } from '../services/redisService';
import { HttpService, IHttpService } from '../services/httpService';
import { Application, IApplication } from '../services/appService';
import { IGeoCodingService, GeoCodingService } from '../services/geoCodingService';
import { PasswordService, IPasswordService } from '../services//passwordService';
import { BasicMiddleware, IBasicMiddleware } from '../middlewares/basicMiddleware';
import { ErrorHandlerMiddleware, IErrorHandlerMiddleware } from '../middlewares/errorHandlerMiddleware';
import { IValidateMiddleware, ValidateMiddleware } from '../middlewares/validateMiddleware';
import { IAuthMiddleware, AuthMiddleware } from '../middlewares/authMiddleware';
import { UserController, IUserController } from '../controllers/userController';
import { LoggerUtil, ILoggerUtil } from '../utils/loggerUtil';
import { IMongooseService, MongooseService } from '../services/mongooseService';
import { IUserService, UserService } from '../services/userService';
import { IUserRepository, UserRepository } from '../repository/userRepository';
import { IJWTService, JWTService } from '../services/jwtService';
import { IAuthenticationService, AuthenticationService } from '../services/authenticationService';
import { IAuthController, AuthController } from '../controllers/authenticationController';
import { IPropertyRepository, PropertyRepository } from '../repository/propertyRepository';
import { IPropertyService, PropertyService } from '../services/propertyService';
import { IPropertyController, PropertyController } from '../controllers/propertyController';
import { IRoutes, Routes } from '../routes';
import { IPropertyRoutes, PropertyRoutes } from '../routes/propertyRoutes';
import { IAuthRoutes, AuthRoutes } from '../routes/authRoutes';
import { IUserRoutes, UserRoutes } from '../routes/userRoutes';
import { SearchQueryFactory } from '../utils/searchQueryBuilderFactoryUtil';
import { RadiusLatLangSearch } from '../utils/searchTypeUtil';

const container = new Container({ defaultScope: 'Singleton' });

/**
* service bindings
*/
container.bind<IRedisService>(IDENTIFIER.RedisService).to(RedisService).inSingletonScope();
container.bind<IHttpService>(IDENTIFIER.HttpService).to(HttpService).inSingletonScope();
container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();
container.bind<IApplication>(IDENTIFIER.Application).to(Application).inSingletonScope();
container.bind<IPasswordService>(IDENTIFIER.PasswordService).to(PasswordService).inSingletonScope();
container.bind<IMongooseService>(IDENTIFIER.MongooseService).to(MongooseService).inSingletonScope();
container.bind<IJWTService>(IDENTIFIER.JWTService).to(JWTService).inSingletonScope();
container.bind<IAuthenticationService>(IDENTIFIER.AuthenticationService).to(AuthenticationService).inSingletonScope();
container.bind<IUserService>(IDENTIFIER.UserService).to(UserService).inSingletonScope();
container.bind<IPropertyService>(IDENTIFIER.PropertyService).to(PropertyService).inSingletonScope();
container.bind<IGeoCodingService>(IDENTIFIER.GeoCodingService).to(GeoCodingService).inSingletonScope();

/**
* middleware binding
*/ 
container.bind<IBasicMiddleware>(IDENTIFIER.BasicMiddleware).to(BasicMiddleware).inSingletonScope();
container.bind<IErrorHandlerMiddleware>(IDENTIFIER.ErrorHandlerMiddleware).to(ErrorHandlerMiddleware).inSingletonScope();
container.bind<IValidateMiddleware>(IDENTIFIER.ValidateMiddleware).to(ValidateMiddleware).inSingletonScope();
container.bind<IAuthMiddleware>(IDENTIFIER.AuthorizationMiddleware).to(AuthMiddleware);

/**
 * repository bindings
 */
container.bind<IUserRepository>(IDENTIFIER.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IPropertyRepository>(IDENTIFIER.PropertyRepository).to(PropertyRepository).inSingletonScope();

/**
 * controller bindings
 */
container.bind<IUserController>(IDENTIFIER.UserController).to(UserController).inSingletonScope();
container.bind<IAuthController>(IDENTIFIER.AuthController).to(AuthController).inSingletonScope();
container.bind<IPropertyController>(IDENTIFIER.PropertyController).to(PropertyController).inSingletonScope();

/**
 * Route bindings
 */
container.bind<IRoutes>(IDENTIFIER.Routes).to(Routes).inSingletonScope();
container.bind<IPropertyRoutes>(IDENTIFIER.PropertyRoutes).to(PropertyRoutes).inSingletonScope();
container.bind<IAuthRoutes>(IDENTIFIER.AuthRoutes).to(AuthRoutes).inSingletonScope();
container.bind<IUserRoutes>(IDENTIFIER.UserRoutes).to(UserRoutes).inSingletonScope();

container.bind<SearchQueryFactory>(IDENTIFIER.SearchQueryFactory).to(SearchQueryFactory);
container.bind<RadiusLatLangSearch>(IDENTIFIER.RadiusLatLangSearch).to(RadiusLatLangSearch);

export default container;
