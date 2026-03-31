import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailState } from './user-detail.state';
import { GetAuthUserUseCase } from '@usecases/auth/get-auth-user.usecase';
import { AuthLocalDataSource } from '@data/datasource/auth/source/auth-local.datasource';
import { ViewState } from '@interfaces/view-state';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class UserDetailViewModel {
  private readonly getAuthUserUseCase = inject(GetAuthUserUseCase);
  private readonly authLocal = inject(AuthLocalDataSource);
  private readonly router = inject(Router);
  private readonly state = new UserDetailState();

  readonly viewState: ViewState<UserDetailState> = this.state;

  init(): void {
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.getAuthUserUseCase.execute().subscribe({
      next: (user) => {
        this.state.user.set(user);
        this.state.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.state.error.set(err instanceof AppError ? err.messageKey : 'errors.unknown');
        this.state.isLoading.set(false);
      },
    });
  }

  logout(): void {
    this.authLocal.clearTokens();
    this.router.navigate(['/login']);
  }
}
