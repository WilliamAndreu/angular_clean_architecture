import { Observable } from 'rxjs';
import { handleOperation } from 'src/domain/errors/handle-operation';
import { UseCase } from 'src/domain/interfaces/use-case';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { UserEntity } from '@models/auth/auth-entity.model';

export class GetAuthUserUseCase implements UseCase<void, UserEntity> {
  constructor(private readonly repo: AuthRepository) {}
  execute(): Observable<UserEntity> {
    return handleOperation(() => this.repo.getAuthUser(), 'errors.unknown');
  }
}
