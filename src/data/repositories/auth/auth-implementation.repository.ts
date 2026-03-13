import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { AuthRemoteDataSource } from '@data/datasource/auth/source/auth-remote.datasource';
import { AuthLocalDataSource } from '@data/datasource/auth/source/auth-local.datasource';
import { LoginDtoToEntityMapper, UserDtoToEntityMapper } from './mappers/auth-dto-to-entity.mapper';
import { TokensDboToEntityMapper } from './mappers/auth-dbo-to-entity.mapper';
import { LoginEntity, TokensEntity, UserEntity } from '@models/auth/auth-entity.model';

@Injectable()
export class AuthImpRepository extends AuthRepository {
  private readonly remote = inject(AuthRemoteDataSource);
  private readonly local = inject(AuthLocalDataSource);
  private readonly loginMapper = inject(LoginDtoToEntityMapper);
  private readonly userMapper = inject(UserDtoToEntityMapper);
  private readonly tokensDboMapper = inject(TokensDboToEntityMapper);

  override login(username: string, password: string): Observable<LoginEntity> {
    return this.remote.login(username, password).pipe(
      map((dto) => this.loginMapper.mapFrom(dto)),
      tap((entity) =>
        this.local.saveTokens(
          this.tokensDboMapper.mapTo({
            accessToken: entity.accessToken,
            refreshToken: entity.refreshToken,
          }),
        ),
      ),
    );
  }

  override getAuthUser(): Observable<UserEntity> {
    return this.remote.getAuthUser().pipe(map((dto) => this.userMapper.mapFrom(dto)));
  }

  override refreshToken(): Observable<TokensEntity> {
    const token = this.local.getRefreshToken();
    if (!token) return throwError(() => new Error('No refresh token available'));
    return this.remote.refreshToken(token).pipe(
      map((dto) =>
        this.tokensDboMapper.mapFrom({
          accessToken: dto.accessToken,
          refreshToken: dto.refreshToken,
        }),
      ),
      tap((entity) => this.local.saveTokens(this.tokensDboMapper.mapTo(entity))),
    );
  }
}
