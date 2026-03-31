import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { UseCase } from '@interfaces/use-case';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { LoginCredentialsEntity, LoginEntity } from '@models/auth/auth-entity.model';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class LoginUseCase implements UseCase<LoginCredentialsEntity, LoginEntity> {
  private readonly repo = inject(AuthRepository);

  execute(params: LoginCredentialsEntity): Observable<LoginEntity> {
    return this.repo.login(params).pipe(
      catchError((err) => {
        if (err instanceof AppError) return throwError(() => err);
        return throwError(() => new AppError('errors.auth.login_failed'));
      }),
    );
  }
}
