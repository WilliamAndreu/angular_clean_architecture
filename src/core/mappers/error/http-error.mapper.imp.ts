import { HttpErrorMapperSource } from 'src/core/mappers/error/source/http-error-mapper.source';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ServerError,
  TimeoutError,
  UnauthorizedError,
  toAppError,
} from 'src/domain/errors/app-error';

/** Override this adapter to understand a project's backend error contract. */
export class HttpErrorMapperImp extends HttpErrorMapperSource {
  override map(error: unknown): AppError {
    if (error instanceof AppError) return error;
    if (!(error instanceof HttpErrorResponse)) return toAppError(error);
    const options = { cause: error };
    switch (error.status) {
      case 0:
        return new NetworkError(undefined, undefined, options);
      case 400:
      case 422:
        return new BadRequestError(undefined, undefined, options);
      case 401:
        return new UnauthorizedError(undefined, undefined, options);
      case 403:
        return new ForbiddenError(undefined, undefined, options);
      case 404:
        return new NotFoundError(undefined, undefined, options);
      case 408:
      case 504:
        return new TimeoutError(undefined, undefined, options);
      case 409:
        return new ConflictError(undefined, undefined, options);
      case 429:
        return new RateLimitError(undefined, undefined, options);
      default:
        return error.status >= 500
          ? new ServerError(undefined, undefined, options)
          : toAppError(error);
    }
  }
}
