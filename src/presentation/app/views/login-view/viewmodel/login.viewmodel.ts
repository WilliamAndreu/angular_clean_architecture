import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginState } from './login.state';
import { LoginUseCase } from '@usecases/auth/login.usecase';
import { ViewState } from 'src/core/models/types/view/view-state.type';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';

@Injectable()
export class LoginViewModel {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly errors = inject(ErrorHandlingSource);
  private readonly state = new LoginState();

  readonly viewState: ViewState<LoginState> = this.state;

  login(username: string, password: string): void {
    if (this.state.isLoading()) return;
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.loginUseCase
      .execute({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.isLoading.set(false);
          this.router.navigate(['/profile']);
        },
        error: (err: unknown) => {
          this.state.error.set(
            this.errors.handle(err, { source: 'operation', operation: 'auth.login' }).messageKey,
          );
          this.state.isLoading.set(false);
        },
      });
  }
}
