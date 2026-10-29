import { ErrorReporterSource } from 'src/core/services/error-reporting/source/error-reporter.source';
import { HttpErrorMapperSource } from 'src/core/mappers/error/source/http-error-mapper.source';
import { ErrorReportPolicy } from 'src/core/models/types/error/error-report-policy.type';
import { ErrorDiagnostics } from 'src/core/models/types/error/error-diagnostics.type';
export interface ErrorHandlingOptions {
  reporter?: ErrorReporterSource;
  diagnostics?: ErrorDiagnostics;
  shouldReport?: ErrorReportPolicy;
  httpMapper?: HttpErrorMapperSource;
}
