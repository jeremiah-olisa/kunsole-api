import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

export interface ServerErrorResponse {
  message: string;
  error?: string;
  statusCode: HttpStatus;
}

@Catch()
export class InternalServerExceptionFilter implements ExceptionFilter {
  // constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost) {
    // const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    // const status = exception.getStatus();

    const exceptionStack = exception?.stack ?? exception?.message;
    const exceptionMessage = exception?.message ?? exception?.stack;

    const errorResponse: ServerErrorResponse = {
      statusCode: httpStatus,
      message:
        process.env?.NODE_ENV !== 'production'
          ? exceptionStack
          : exceptionMessage,
      error: exception?.name ?? 'We encountered a problem, please try again',
    };

    // console.log({ EName: exception?.name, ECause: exception?.stack, errorResponse, httpStatus })

    response
      .status(httpStatus)
      .json(
        httpStatus == 500
          ? errorResponse
          : (exception.getResponse() ?? exception),
      );
  }
}
