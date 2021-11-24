import Joi from 'joi';
import { injectable } from 'inversify';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errorUtil';

export interface IValidateMiddleware {
  validate(schema: Joi.Schema): RequestHandler;
  validateQuery(schema: Joi.Schema): RequestHandler
}

@injectable()
export class ValidateMiddleware implements IValidateMiddleware {
  constructor() {}

  public validate(schema: Joi.Schema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = schema.validate(req.body);
        if (error) {
          throw new BadRequestError(error.message);
        }
        req.body = value;
        next();
      } catch (err) {
        next(err);
      }
    }
  }

  public validateQuery(schema: Joi.Schema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = schema.validate(req.query);
        if (error) {
          throw new BadRequestError(error.message);
        }
        req.query = value;
        next();
      } catch (err) {
        next(err);
      }
    }
  }
}