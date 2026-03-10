import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {
  AppError,
  NetworkError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from 'src/core/errors/app-error';

export const publicInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const appError = mapHttpError(error);
      return throwError(() => appError);
    }),
  );
};

function mapHttpError(error: HttpErrorResponse): AppError {
  if (error.status === 401) return new UnauthorizedError('errors.unauthorized');
  if (error.status === 404) return new NotFoundError('errors.not_found');
  if (error.status === 0) return new NetworkError('errors.network');
  if (error.status >= 500) return new ServerError('errors.server');
  return new AppError('errors.unknown');
}
