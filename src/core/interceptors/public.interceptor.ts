import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorMapperSource } from 'src/core/mappers/error/source/http-error-mapper.source';

/** Normalize transport failures; recovery, reporting and UI belong to their callers. */
export const publicInterceptor: HttpInterceptorFn = (req, next) => {
  const mapper = inject(HttpErrorMapperSource);
  return next(req).pipe(catchError((error: unknown) => throwError(() => mapper.map(error))));
};
