import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || 'Lỗi hệ thống không xác định!';
    let errorsDetail: string[] | null = null;

    if (exception instanceof HttpException) {
      const resResponse: any = exception.getResponse();
      
      if (typeof resResponse === 'object' && resResponse.message) {
        if (Array.isArray(resResponse.message)) {
          message = 'Dữ liệu đầu vào không hợp lệ!';
          errorsDetail = resResponse.message;
        } else {
          message = resResponse.message;
        }
      }
    } else {
      console.error('--- [SYSTEM ERROR] ---', exception);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      errors: errorsDetail,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
