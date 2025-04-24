import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomInt } from 'node:crypto';
//common imports
import { ColorEnums, logTrace } from '../../common/logger';

@Injectable()
export class CryptoService {
  public async createHash(plain: string) {
    // logTrace('hashing string', plain, LogColors.FgYellow)
    try {
      const hash = await argon2.hash(plain);
      return hash;
    } catch (e) {
      logTrace('hashing Error', e.message, ColorEnums.BgMagenta);
      throw new ServiceUnavailableException('Internal Server Error');
    }
    // return await argon2.hash(plain)
  }

  public async verifyHash(hash: string, plain: string) {
    try {
      return await argon2.verify(hash, plain);
    } catch (e) {
      logTrace('verifyHashErr-', e.message, ColorEnums.BgMagenta);
      logTrace(hash, plain);
      throw new ServiceUnavailableException('Internal server Error');
    }
  }

  public randomCode() {
    return randomInt(1000_000).toString().padStart(6, '0');
  }
}
