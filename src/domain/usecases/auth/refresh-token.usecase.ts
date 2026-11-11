import { handleOperation } from 'src/domain/errors/handle-operation';
import { Observable } from 'rxjs';
import { UseCase } from 'src/domain/interfaces/use-case';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { TokensEntity } from '@models/auth/auth-entity.model';

export class RefreshTokenUseCase implements UseCase<void, TokensEntity> {
  constructor(private readonly repo: AuthRepository) {}

  execute(): Observable<TokensEntity> {
    return handleOperation(() => this.repo.refreshToken());
  }
}
