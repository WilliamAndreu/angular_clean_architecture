import { catchError, defer, Observable, throwError } from 'rxjs';
import { toAppError } from './app-error';
/** Normalize both synchronous adapter throws and asynchronous Observable failures. */
export function handleOperation<T>(
  operation: () => Observable<T>,
  fallbackKey = 'errors.unknown',
): Observable<T> {
  return defer(operation).pipe(
    catchError((error: unknown) => throwError(() => toAppError(error, fallbackKey))),
  );
}
