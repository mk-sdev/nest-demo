import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).json({
      success: false,
      error: 'Resource Not Found',
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      aaa: 'bbb',
    });
  }
}
