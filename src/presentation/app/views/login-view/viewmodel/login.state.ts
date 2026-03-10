import { signal } from '@angular/core';

export class LoginState {
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
}
