import { InjectionToken } from '@angular/core';
import { ErrorReportPolicy } from 'src/core/models/types/error/error-report-policy.type';
import { ErrorDiagnostics } from 'src/core/models/types/error/error-diagnostics.type';
import {
  DEFAULT_ERROR_REPORT_POLICY,
  DEFAULT_ERROR_DIAGNOSTICS,
} from 'src/core/config/constants/error/error-handling.constants';
export const ERROR_REPORT_POLICY = new InjectionToken<ErrorReportPolicy>('ERROR_REPORT_POLICY', {
  providedIn: 'root',
  factory: () => DEFAULT_ERROR_REPORT_POLICY,
});
export const ERROR_DIAGNOSTICS = new InjectionToken<ErrorDiagnostics>('ERROR_DIAGNOSTICS', {
  providedIn: 'root',
  factory: () => DEFAULT_ERROR_DIAGNOSTICS,
});
