import dotenv from 'dotenv';

dotenv.config();

export default {
  NODE_ENV : process.env.NODE_ENV,
  PORT : Number(process.env.PORT),
  KEEP_ALIVE_TIMEOUT : Number(process.env.KEEP_ALIVE_TIMEOUT),
  SERVER_TIMEOUT: Number(process.env.SERVER_TIMEOUT),
  REDIS:  {
    HOST: Number(process.env.REDIS_HOST),
    PORT: Number(process.env.REDIS_PORT),
  },
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
  DATABASE_CONFIG: {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING
  },
  LOCATION_PROVIDER: process.env.LOCATION_PROVIDER,
  LOCATION_API_KEY: process.env.LOCATION_API_KEY // google api key with billing and geocodng service enabled
}