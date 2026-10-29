import { toAppError } from 'src/domain/errors/app-error';
import { ConsoleErrorReporterServiceImp } from 'src/core/services/error-reporting/console/console-error-reporter.service.imp';
import { ErrorReporterSource } from 'src/core/services/error-reporting/source/error-reporter.source';

/** Bootstrap may fail before an injector or any UI is available. */
export function reportBootstrapError(
  error: unknown,
  reporter: ErrorReporterSource = new ConsoleErrorReporterServiceImp(),
): void {
  const failure = toAppError(error);
  try {
    const result = reporter.report(
      Object.freeze({
        code: failure.code,
        kind: failure.kind,
        source: 'bootstrap',
        timestamp: new Date().toISOString(),
      }),
    );
    if (result) void Promise.resolve(result).catch(() => undefined);
  } catch {
    /* No Angular handler is available yet. Never rethrow from this boundary. */
  }
}
