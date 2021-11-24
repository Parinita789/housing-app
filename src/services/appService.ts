import { inject, injectable } from 'inversify';
import { IDENTIFIER } from '../constants/identifier';
import { ILoggerUtil } from '../utils/loggerUtil';
import { IHttpService } from '../services/httpService';
import { IRedisService } from '../services/redisService';
import { IMongooseService } from './mongooseService';
import { IGeoCodingService } from './geoCodingService';

export interface IApplication {
  initializeApplication(): Promise<void>;
  gracefulShutdown(): void;
}

@injectable()
export class Application implements IApplication { 
  private logger;
  private httpService;
  private redisService;
  private mongooseService;
  private geoCodingService;

  constructor(
    @inject(IDENTIFIER.RedisService) redisService: IRedisService,
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil,
    @inject(IDENTIFIER.HttpService) httpService: IHttpService,
    @inject(IDENTIFIER.MongooseService) mongooseService: IMongooseService,
    @inject(IDENTIFIER.GeoCodingService) geoCodingService: IGeoCodingService
  ) {
    this.redisService = redisService;
    this.logger = logger;
    this.httpService = httpService;
    this.mongooseService = mongooseService;
    this.geoCodingService = geoCodingService;
  }

  public async initializeApplication(): Promise<void> {
    try {  
      await Promise.all([
        this.redisService.initializeClient(),
        this.httpService.initializeServer(),
        this.mongooseService.openConnection(),
        this.geoCodingService.createClient()
      ])
      this.logger.info('Application Started');
    } catch (error) {
      this.logger.error(`error in applicationService initializeApplication - ${error}`);
      this.gracefulShutdown();
    }
  }

  public gracefulShutdown(): void {
    this.httpService.httpServer.close(() => {
      this.redisService.shutdownClient();
      process.exit(1);
    })
  }
}