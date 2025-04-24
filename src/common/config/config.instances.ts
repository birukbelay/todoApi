import * as dotenv from 'dotenv';
import { ColorEnums, logTrace } from '../logger';
import { ENV_DEFAULT, ENV_NAMES, ENV_TYPES, getMongoUri, tryReadEnv } from './config.utills';
// import fs from 'fs';

export const LOAD_ENVS = (req = false): ENV_TYPES => {
  return {
    ...ENV_DEFAULT,
    NODE_ENV: tryReadEnv('NODE_ENV'),
    PORT: tryReadEnv(ENV_NAMES.PORT, req),
    //Database
    MONGODB_URI: getMongoUri(ENV_NAMES.MONGODB_URI, req),
    //Jwt Related
    JWT_ACCESS_SECRET: tryReadEnv(ENV_NAMES.JWT_ACCESS_SECRET, req),
    JWT_REFRESH_SECRET: tryReadEnv(ENV_NAMES.JWT_REFRESH_SECRET, req),
    JWT_EXPIRY_TIME: tryReadEnv(ENV_NAMES.JWT_EXPIRY_TIME, req, ENV_DEFAULT.JWT_EXPIRY_TIME),
    JWT_REFRESH_HALF_LIFE: tryReadEnv(
      ENV_NAMES.JWT_REFRESH_HALF_LIFE,
      req,
      ENV_DEFAULT.JWT_REFRESH_HALF_LIFE,
    ),
    JWT_REFRESH_EXPIRY_TIME: tryReadEnv(
      ENV_NAMES.JWT_REFRESH_EXPIRY_TIME,
      req,
      ENV_DEFAULT.JWT_REFRESH_EXPIRY_TIME,
    ),
    ENCRYPTION_KEY: tryReadEnv(ENV_NAMES.ENCRYPTION_KEY, req),
    //  Firebase envs

    //======Cloudinary
    CLOUDINARY_CLOUD_NAME: tryReadEnv(ENV_NAMES.CLOUDINARY_CLOUD_NAME, req),
    CLOUDINARY_API_KEY: tryReadEnv(ENV_NAMES.CLOUDINARY_API_KEY, req),
    CLOUDINARY_API_SECRET: tryReadEnv(ENV_NAMES.CLOUDINARY_API_SECRET, req),
  };
};

export class EnvVar {
  private static _instance: EnvVar;
  envVariables: ENV_TYPES;

  private constructor() {
    // we must have a .env upload to tell us the Enviroment at first, it first read the .env upload then it loads the other env files
    dotenv.config({ path: `.env` });
    let mode = tryReadEnv('NODE_ENV', false, '');

    // MODE IS PRODUCTION
    if (mode === 'prod') {
      dotenv.config({ path: `.env.${mode}` });
      this.envVariables = LOAD_ENVS(true);
    } else {
      // MODE COULD BE TEST || dev
      logTrace(`NODE_ENV is --| == ${mode ? mode : 'NO Node_ENV'} ==`, '', ColorEnums.BgMagenta);
      if (!mode) mode = 'dev';
      dotenv.config({ path: `.env.${mode}` });
      this.envVariables = LOAD_ENVS(false);
    }
  }

  static get getInstance() {
    if (!EnvVar._instance) {
      EnvVar._instance = new EnvVar();
    }
    return this._instance.envVariables;
    // Do you need arguments? Make it a regular static method instead.
    // return this._instance || (this._instance = new this());
  }
}
