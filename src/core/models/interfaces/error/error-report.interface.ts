import { ErrorKind } from 'src/domain/errors/app-error';
import { ErrorHandlingContext } from './error-handling-context.interface';
export interface ErrorReport {
  readonly code: string;
  readonly kind: ErrorKind;
  readonly source: ErrorHandlingContext['source'];
  readonly operation?: string;
  readonly timestamp: string;
  readonly details?: Readonly<Record<string, string | number | boolean | null>>;
}
