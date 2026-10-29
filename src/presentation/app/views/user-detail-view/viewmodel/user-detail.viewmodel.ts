import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailState } from './user-detail.state';
import { GetAuthUserUseCase } from '@usecases/auth/get-auth-user.usecase';
import { LogoutUseCase } from '@usecases/auth/logout.usecase';
import { ViewState } from 'src/core/models/types/view/view-state.type';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';

@Injectable()
export class UserDetailViewModel {
  private readonly getAuthUserUseCase = inject(GetAuthUserUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly errors = inject(ErrorHandlingSource);
  private readonly state = new UserDetailState();

  readonly viewState: ViewState<UserDetailState> = this.state;

  init(): void {
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.getAuthUserUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.state.user.set(user);
          this.state.isLoading.set(false);
        },
        error: (err: unknown) => {
          this.state.error.set(
            this.errors.handle(err, { source: 'operation', operation: 'auth.profile' }).messageKey,
          );
          this.state.isLoading.set(false);
        },
      });
  }

  logout(): void {
    this.logoutUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.user.set(null);
          void this.router.navigate(['/login']);
        },
        error: (err: unknown) =>
          this.state.error.set(
            this.errors.handle(err, { source: 'operation', operation: 'auth.logout' }).messageKey,
          ),
      });
  }
}
