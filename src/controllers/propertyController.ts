import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IDENTIFIER } from '../constants/identifier';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { IPropertyService } from '../services/propertyService';
import { ILoggerUtil } from '../utils/loggerUtil';
import container from '../config/diConfig';

export interface IPropertyController {
  createProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProperty(req: Request, res: Response, next: NextFunction): Promise<void>
}

@injectable()
export class PropertyController implements IPropertyController {
  private propertyService;
  private logger;

  constructor (
    @inject(IDENTIFIER.PropertyService) propertyService: IPropertyService,
    @inject(IDENTIFIER.Logger) logger: ILoggerUtil
  ) {
    this.propertyService = propertyService;
    this.logger = logger;
  }

  async createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = container.get<ILoggerUtil>(IDENTIFIER.Logger);
    try { 
      const propertyService = container.get<IPropertyService>(IDENTIFIER.PropertyService);
      const property = await propertyService.addProperty(req.body);
      res.send({ 
        status: HTTP_STATUS_CODES.CREATED,
        message: 'Property added Successfully', 
        data: property
      });
    } catch (err) {
      logger.error(`err in controller - propertyController - createProperty - ${err}`);
      next(err)
    }
  }

  async getProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = container.get<ILoggerUtil>(IDENTIFIER.Logger);
    try { 
      const propertyService = container.get<IPropertyService>(IDENTIFIER.PropertyService);
      const data = await propertyService.getProperty(req.query as any);
      res.send({ 
        status: HTTP_STATUS_CODES.OK,
        message: 'Property fetched Successfully',
        data: data
      });
    } catch (err) {
      logger.error(`err in controller - propertyController - getProperty - ${err}`);
      next(err)
    }
  }
   
}