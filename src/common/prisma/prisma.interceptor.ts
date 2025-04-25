import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { InvalidFormException as PrismaException } from '../exceptions/invalid.form.exception';
import { PRISMA_ERRORS } from './prisma.constant';

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        // console.log(error);

        if (error instanceof PrismaClientKnownRequestError) {
          const constraint =
            error.meta && typeof error.meta['target'] == 'string'
              ? error.meta['target']
              : ((error.meta?.['target'] as any)?.join(', ') ?? '');

          const customMessage = PRISMA_ERRORS[error.code]?.replace(
            '{constraint}',
            constraint,
          );

          const errors = {
            [constraint]: customMessage,
          };

          const prismaErrorSplitStr = `invocation:\n\n\n  `;

          const errorMessage =
            error.message.split(prismaErrorSplitStr)[1] || error.message;

          throw new PrismaException(
            errors,
            (error.meta?.['cause'] ?? errorMessage) as any,
          );
        } else {
          throw error;
        }
      }),
    );
  }
}
