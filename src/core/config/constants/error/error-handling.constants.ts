import { ErrorReportPolicy } from 'src/core/models/types/error/error-report-policy.type';
import { ErrorDiagnostics } from 'src/core/models/types/error/error-diagnostics.type';
export const DEFAULT_ERROR_REPORT_POLICY: ErrorReportPolicy = (error, context) =>
  context.source !== 'operation' || error.kind === 'unexpected' || error.kind === 'server';
export const DEFAULT_ERROR_DIAGNOSTICS: ErrorDiagnostics = () => undefined;
