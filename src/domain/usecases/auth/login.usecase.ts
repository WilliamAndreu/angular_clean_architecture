import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { UseCase } from '@interface-core/use-case';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { LoginEntity } from '@models/auth/auth-entity.model';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class LoginUseCase implements UseCase<{ username: string; password: string }, LoginEntity> {
  private readonly repo = inject(AuthRepository);

  execute(params: { username: string; password: string }): Observable<LoginEntity> {
    return this.repo.login(params.username, params.password).pipe(
      catchError((err) => {
        if (err instanceof AppError) return throwError(() => err);
        return throwError(() => new AppError('errors.auth.login_failed'));
      }),
    );
  }
}
