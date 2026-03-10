import { inject, Injectable } from '@angular/core';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';
import { TokensEntity } from '@models/auth/auth-entity.model';
import { AuthLocalDataSource } from '../source/auth-local.datasource';

@Injectable()
export class AuthLocalDataSourceImp extends AuthLocalDataSource {
  private readonly storage = inject(StorageSource);

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  override saveTokens(tokens: TokensEntity): void {
    this.storage.set(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    this.storage.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  override getAccessToken(): string | null {
    return this.storage.get<string>(this.ACCESS_TOKEN_KEY);
  }

  override getRefreshToken(): string | null {
    return this.storage.get<string>(this.REFRESH_TOKEN_KEY);
  }

  override clearTokens(): void {
    this.storage.remove(this.ACCESS_TOKEN_KEY);
    this.storage.remove(this.REFRESH_TOKEN_KEY);
  }
}
