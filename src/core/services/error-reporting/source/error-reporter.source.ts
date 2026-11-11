import { ErrorReport } from 'src/core/models/interfaces/error/error-report.interface';
export abstract class ErrorReporterSource {
  abstract report(event: ErrorReport): void | Promise<void>;
}
