process.env.NODE_ENV = 'development';
process.env.PORT = '8000';

import { should, expect } from 'chai';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { IDENTIFIER } from '../../src/constants/identifier';
import { UserService, IUserService } from '../../src/services/userService';
import { LoggerUtil, ILoggerUtil } from '../../src/utils/loggerUtil';
import { IUserRepository, UserRepository } from '../../src/repository/userRepository';
import { IPasswordService, PasswordService } from '../../src/services/passwordService';

describe('Test User Service', () => {
  let userService: IUserService;
  let randomNumber = Math.floor(Math.random()*(999-100+1)+100);

  const user = {
    first_name: 'Parinita',
    last_name: 'Kumari',
    email: `parinita${randomNumber}@gmail.com`,
    password: '123456',
    user_type: 'OWNER',
    phone_number: '+919334445729'
  }

  before(() => {
    const container = new Container();
    container.bind<IUserService>(IDENTIFIER.UserService).to(UserService).inSingletonScope();
    container.bind<ILoggerUtil>(IDENTIFIER.Logger).to(LoggerUtil).inSingletonScope();
    container.bind<IUserRepository>(IDENTIFIER.UserRepository).to(UserRepository).inSingletonScope();
    container.bind<IPasswordService>(IDENTIFIER.PasswordService).to(PasswordService).inSingletonScope();
    userService = container.get(IDENTIFIER.UserService);
  });

  it('It should save user in users collection', async (done) => {
    const userData = await userService.createUser(user);
    // mocked user data should be equal to the new user created
    done();
  });
});

