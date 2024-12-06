import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : 500;

        Sentry.captureException(exception);

        response.status(status).json({
            statusCode: status,
            message:
                exception instanceof HttpException
                    ? exception.getResponse()
                    : 'Internal server error',
        });
    }
}
