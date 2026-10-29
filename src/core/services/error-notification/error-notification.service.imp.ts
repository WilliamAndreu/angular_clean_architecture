import { ErrorNotificationSource } from './source/error-notification.source';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorNotificationServiceImp extends ErrorNotificationSource {
  private readonly visible = signal(false);
  override readonly isVisible = this.visible.asReadonly();
  override show(): void {
    this.visible.set(true);
  }
  override dismiss(): void {
    this.visible.set(false);
  }
}
