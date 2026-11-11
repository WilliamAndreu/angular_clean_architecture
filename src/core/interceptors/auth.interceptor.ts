import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { environment } from 'src/core/config/environments/environment';
import { UnauthorizedError, BadRequestError } from 'src/domain/errors/app-error';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthRepository);
  const router = inject(Router);
  const api = req.url.startsWith(`${environment.apiBaseUrl}/`);
  const credentialsEndpoint = /\/auth\/(login|refresh)(?:\?|$)/.test(req.url);
  if (!api || credentialsEndpoint) return next(req);
  const token = auth.getAccessToken();
  const authenticated = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(authenticated).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) return throwError(() => err);
      return auth.refreshToken().pipe(
        switchMap((tokens) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } })),
        ),
        catchError((failure: unknown) => {
          if (
            failure instanceof UnauthorizedError ||
            failure instanceof BadRequestError ||
            (failure instanceof HttpErrorResponse && failure.status === 401)
          ) {
            return auth.logout().pipe(
              switchMap(() => {
                void router.navigate(['/login']);
                return throwError(() => failure);
              }),
            );
          }
          return throwError(() => failure);
        }),
      );
    }),
  );
};
