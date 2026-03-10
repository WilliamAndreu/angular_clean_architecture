import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '@interface-core/use-case';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { TokensEntity } from '@models/auth/auth-entity.model';

@Injectable()
export class RefreshTokenUseCase implements UseCase<void, TokensEntity> {
  private readonly repo = inject(AuthRepository);

  execute(): Observable<TokensEntity> {
    return this.repo.refreshToken();
  }
}
