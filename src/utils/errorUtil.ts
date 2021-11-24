class BaseError extends Error {    
  constructor(description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
    
export class InternalServerError extends BaseError {
  constructor (description) {
    super(description);
    this.name = 'Internal Server Error';
  }
}
       
export class BadRequestError extends BaseError {
  constructor (description) {
    super(description);
    this.name = 'Bad Request';
  }
}
  
export class DuplicateError extends BaseError {
  constructor(description: string) {
    super(description);
    this.name = 'Duplicate Error';
  }
}

export class AuthorizationError extends BaseError {
  constructor(description: string) {
    super(description);
    this.name = 'Authorization Error';
  }
}