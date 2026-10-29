import { Observable, throwError } from 'rxjs';
import { handleOperation } from 'src/domain/errors/handle-operation';
import { InvalidCredentialsError } from 'src/domain/errors/auth/auth.errors';
import { UseCase } from 'src/domain/interfaces/use-case';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { LoginCredentialsEntity, LoginEntity } from '@models/auth/auth-entity.model';

export class LoginUseCase implements UseCase<LoginCredentialsEntity, LoginEntity> {
  constructor(private readonly repo: AuthRepository) {}
  execute(params: LoginCredentialsEntity): Observable<LoginEntity> {
    if (!params.username.trim() || !params.password)
      return throwError(() => new InvalidCredentialsError());
    return handleOperation(
      () => this.repo.login({ ...params, username: params.username.trim() }),
      'errors.auth.login_failed',
    );
  }
}
