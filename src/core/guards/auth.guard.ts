import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { RestoreSessionUseCase } from '@usecases/auth/restore-session.usecase';

export const authGuard: CanActivateFn = () => {
  const errors = inject(ErrorHandlingSource);
  const session = inject(RestoreSessionUseCase);
  const router = inject(Router);
  return session.execute().pipe(
    map((active) => (active ? true : router.createUrlTree(['/login']))),
    catchError((error: unknown) => {
      errors.handle(error, { source: 'operation', operation: 'auth.restore' });
      return of(router.createUrlTree(['/login'], { queryParams: { session: 'unavailable' } }));
    }),
  );
};
