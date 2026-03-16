import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { UseCase } from '@interface-core/use-case';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { UserEntity } from '@models/auth/auth-entity.model';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class GetAuthUserUseCase implements UseCase<void, UserEntity> {
  private readonly repo = inject(AuthRepository);

  execute(): Observable<UserEntity> {
    return this.repo.getAuthUser().pipe(
      catchError((err) => {
        if (err instanceof AppError) return throwError(() => err);
        return throwError(() => new AppError('errors.unknown'));
      }),
    );
  }
}
