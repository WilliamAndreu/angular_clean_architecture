import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';
import { inject, Injectable } from '@angular/core';
import { AppError, toAppError } from 'src/domain/errors/app-error';
import { ERROR_DIAGNOSTICS } from 'src/core/config/tokens/error/error-handling.tokens';
import { ErrorReporterSource } from 'src/core/services/error-reporting/source/error-reporter.source';
import { ERROR_REPORT_POLICY } from 'src/core/config/tokens/error/error-handling.tokens';
import { ErrorHandlingContext } from 'src/core/models/interfaces/error/error-handling-context.interface';
import { ErrorReport } from 'src/core/models/interfaces/error/error-report.interface';

@Injectable({ providedIn: 'root' })
export class ErrorHandlingServiceImp extends ErrorHandlingSource {
  private readonly diagnostics = inject(ERROR_DIAGNOSTICS);
  private readonly reporter = inject(ErrorReporterSource);
  private readonly policy = inject(ERROR_REPORT_POLICY);
  private readonly reported = new WeakSet<object>();
  private reporting = false;

  /** Returns the typed error so each operation owns its own state and recovery. */
  override handle(
    error: unknown,
    context: ErrorHandlingContext = { source: 'operation' },
  ): AppError {
    const failure = toAppError(error);
    // A reporter/policy must not recursively report its own failures.
    if (this.reporting) return failure;
    const chain = this.errorChain(failure);
    if (chain.some((item) => this.reported.has(item))) return failure;
    this.reporting = true;
    try {
      if (!this.policy(failure, context)) return failure;
      chain.forEach((item) => this.reported.add(item));
      let details: ErrorReport['details'];
      try {
        const projected = this.diagnostics(failure);
        if (projected) details = Object.freeze({ ...projected });
      } catch {
        /* Optional diagnostics must not prevent the base report. */
      }
      const event: ErrorReport = Object.freeze({
        code: failure.code,
        kind: failure.kind,
        source: context.source,
        operation: context.operation,
        timestamp: new Date().toISOString(),
        ...(details ? { details } : {}),
      });
      // Attach rejection handling immediately; telemetry cannot break the original operation.
      const result = this.reporter.report(event);
      if (result) void Promise.resolve(result).catch(() => undefined);
    } catch {
      /* Reporting is best effort and must not become a new application error. */
    } finally {
      this.reporting = false;
    }
    return failure;
  }
  private errorChain(error: AppError): object[] {
    const chain: object[] = [];
    let current: unknown = error;
    // Bound traversal and handle circular cause chains.
    while (current instanceof Error && chain.length < 16 && !chain.includes(current)) {
      chain.push(current);
      const descriptor = Object.getOwnPropertyDescriptor(current, 'cause');
      current = descriptor && 'value' in descriptor ? descriptor.value : undefined;
    }
    return chain;
  }
}
