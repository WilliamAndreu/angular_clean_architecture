import { Signal } from '@angular/core';

/** Notification contract. Each project decides how to present notifications. */
export abstract class ErrorNotificationSource {
  abstract readonly isVisible: Signal<boolean>;
  abstract show(): void;
  abstract dismiss(): void;
}
