import { ErrorNotificationSource } from 'src/core/services/error-notification/source/error-notification.source';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';

@Injectable()
export class GlobalErrorHandlerImp implements ErrorHandler {
  private readonly notice = inject(ErrorNotificationSource);
  private readonly errors = inject(ErrorHandlingSource);
  handleError(error: unknown): void {
    const original =
      typeof ErrorEvent !== 'undefined' && error instanceof ErrorEvent
        ? (error.error ?? error)
        : typeof PromiseRejectionEvent !== 'undefined' && error instanceof PromiseRejectionEvent
          ? error.reason
          : error;
    this.errors.handle(original, { source: 'global' });
    this.notice.show();
  }
}
