import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginState } from './login.state';
import { LoginUseCase } from '@usecases/auth/login.usecase';
import { ViewState } from '@interfaces/view-state';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class LoginViewModel {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);
  private readonly state = new LoginState();

  readonly viewState: ViewState<LoginState> = this.state;

  login(username: string, password: string): void {
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.loginUseCase.execute({ username, password }).subscribe({
      next: () => {
        this.state.isLoading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err: unknown) => {
        this.state.error.set(err instanceof AppError ? err.messageKey : 'errors.unknown');
        this.state.isLoading.set(false);
      },
    });
  }
}
