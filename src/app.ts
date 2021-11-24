import container from './config/diConfig';
import { IDENTIFIER } from './constants/identifier';
import { IApplication } from './services/appService';

// Start application
container.get<IApplication>(IDENTIFIER.Application).initializeApplication();