import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ColorEnums, logTrace } from './logger';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const errorMessage = 'An internal server error occurred. Please try again later.';

    try {
      let status = exception.getStatus();
      if (status == 415) {
        status = 400;
      }
      const respMessage = exception.getResponse();
      logTrace(status, exception.getResponse(), ColorEnums.FgGreen, 3);
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        // Customize your error message here
        response.status(status).json({ message: errorMessage });
      } else if (typeof respMessage == 'string') {
        response.status(status).json({ message: respMessage });
      } else if (typeof respMessage === 'object' && respMessage['message'] != undefined) {
        return response.status(status).json({ message: respMessage['message'] });
      } else if (typeof respMessage == 'object') {
        response.status(status).json({ message: respMessage['message'] });
      } else {
        // For other error statuses, you can handle them differently if needed
        response.status(status).json({ message: respMessage });
      }
    } catch (error) {
      response.status(500).json({ message: errorMessage });
    }
  }
}
