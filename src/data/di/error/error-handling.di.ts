import { ErrorNotificationSource } from 'src/core/services/error-notification/source/error-notification.source';
import { ErrorNotificationServiceImp } from 'src/core/services/error-notification/error-notification.service.imp';
import { ErrorHandlingOptions } from 'src/core/models/interfaces/error/error-handling-options.interface';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';
import { ErrorHandlingServiceImp } from 'src/core/services/error-handling/error-handling.service.imp';
import { ConsoleErrorReporterServiceImp } from 'src/core/services/error-reporting/console/console-error-reporter.service.imp';
import { HttpErrorMapperImp } from 'src/core/mappers/error/http-error.mapper.imp';
import { ErrorHandler, makeEnvironmentProviders } from '@angular/core';
import { GlobalErrorHandlerImp } from 'src/core/handlers/error/global-error.handler.imp';
import { ERROR_DIAGNOSTICS } from 'src/core/config/tokens/error/error-handling.tokens';
import { ErrorReporterSource } from 'src/core/services/error-reporting/source/error-reporter.source';
import { ERROR_REPORT_POLICY } from 'src/core/config/tokens/error/error-handling.tokens';
import { HttpErrorMapperSource } from 'src/core/mappers/error/source/http-error-mapper.source';
/** Project-specific choices are assembled here; the domain is unaffected. */
export function provideErrorHandling(options: ErrorHandlingOptions = {}) {
  return makeEnvironmentProviders([
    { provide: ErrorHandler, useClass: GlobalErrorHandlerImp },
    { provide: ErrorNotificationSource, useExisting: ErrorNotificationServiceImp },
    { provide: ErrorHandlingSource, useExisting: ErrorHandlingServiceImp },
    { provide: ErrorReporterSource, useClass: ConsoleErrorReporterServiceImp },
    { provide: HttpErrorMapperSource, useClass: HttpErrorMapperImp },
    ...(options.diagnostics ? [{ provide: ERROR_DIAGNOSTICS, useValue: options.diagnostics }] : []),
    ...(options.reporter ? [{ provide: ErrorReporterSource, useValue: options.reporter }] : []),
    ...(options.shouldReport
      ? [{ provide: ERROR_REPORT_POLICY, useValue: options.shouldReport }]
      : []),
    ...(options.httpMapper
      ? [{ provide: HttpErrorMapperSource, useValue: options.httpMapper }]
      : []),
  ]);
}
