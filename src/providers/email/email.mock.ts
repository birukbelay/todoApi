import { Injectable } from '@nestjs/common';
import { Resp } from '../../common/constants/return.consts';
import { VerificationServiceInterface } from '../verification/verification.interface';

@Injectable()
export class EmailMockService implements VerificationServiceInterface {
  sendEmailLinkConfirmation(email: string, token: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  sendVerificationCode(to: string, code: string): Promise<Resp<any>> {
    // logTrace('----------------------TO:', to, ColorEnums.FgYellow);
    // logTrace('----------------------Code :', code, ColorEnums.FgYellow);

    return Promise.resolve(undefined);
  }
}
