import { ErrorReport } from 'src/core/models/interfaces/error/error-report.interface';
import { ErrorReporterSource } from '../source/error-reporter.source';
export class ConsoleErrorReporterServiceImp extends ErrorReporterSource {
  override report(event: ErrorReport): void {
    console.error('[Application error]', event);
  }
}
