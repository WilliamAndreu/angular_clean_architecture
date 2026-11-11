import { toAppError } from 'src/domain/errors/app-error';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, of, defer, finalize, shareReplay } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { AuthRemoteDataSource } from 'src/data/datasource/auth/source/auth-remote.source';
import { AuthLocalDataSource } from 'src/data/datasource/auth/source/auth-local.source';
import {
  LoginDtoToEntityMapperImp,
  UserDtoToEntityMapperImp,
} from 'src/data/repositories/auth/mappers/auth-dto-to-entity.mapper.imp';
import { TokensDboToEntityMapperImp } from 'src/data/repositories/auth/mappers/auth-dbo-to-entity.mapper.imp';
import { LoginCredentialsDtoMapperImp } from 'src/data/repositories/auth/mappers/login-credentials-dto.mapper.imp';
import {
  LoginCredentialsEntity,
  LoginEntity,
  TokensEntity,
  UserEntity,
} from '@models/auth/auth-entity.model';
import { AppError, BadRequestError, UnauthorizedError } from 'src/domain/errors/app-error';
import { InvalidCredentialsError, SessionExpiredError } from 'src/domain/errors/auth/auth.errors';

@Injectable()
export class AuthRepositoryImp extends AuthRepository {
  private readonly remote = inject(AuthRemoteDataSource);
  private readonly local = inject(AuthLocalDataSource);
  private readonly loginMapper = inject(LoginDtoToEntityMapperImp);
  private readonly userMapper = inject(UserDtoToEntityMapperImp);
  private readonly tokensDboMapper = inject(TokensDboToEntityMapperImp);
  private readonly credentialsMapper = inject(LoginCredentialsDtoMapperImp);

  override login(credentials: LoginCredentialsEntity): Observable<LoginEntity> {
    return this.remote.login(this.credentialsMapper.mapTo(credentials)).pipe(
      map((dto) => this.loginMapper.mapFrom(dto)),
      tap((entity) => {
        this.sessionVersion++;
        this.local.saveTokens(
          this.tokensDboMapper.mapTo({
            accessToken: entity.accessToken,
            refreshToken: entity.refreshToken,
          }),
        );
      }),
      catchError((err: unknown) => {
        if (err instanceof UnauthorizedError || err instanceof BadRequestError)
          return throwError(
            () =>
              new InvalidCredentialsError('errors.auth.invalid_credentials', undefined, {
                cause: err,
              }),
          );
        if (err instanceof AppError) return throwError(() => err);
        return throwError(() => toAppError(err, 'errors.server'));
      }),
    );
  }

  override getAuthUser(): Observable<UserEntity> {
    return this.remote.getAuthUser().pipe(
      map((dto) => this.userMapper.mapFrom(dto)),
      catchError((err: unknown) => {
        if (err instanceof UnauthorizedError)
          return throwError(
            () => new SessionExpiredError('errors.auth.session_expired', undefined, { cause: err }),
          );
        if (err instanceof AppError) return throwError(() => err);
        return throwError(() => toAppError(err, 'errors.server'));
      }),
    );
  }

  private refreshRequest?: Observable<TokensEntity>;
  private sessionVersion = 0;

  override getAccessToken(): string | null {
    return this.local.getAccessToken();
  }

  override restoreSession(): Observable<boolean> {
    return defer(() => {
      const token = this.local.getAccessToken();
      if (token) {
        try {
          const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
          ) as { exp?: number };
          if (typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() + 30000)
            return of(true);
        } catch {
          /* Invalid JWTs must be refreshed or discarded. */
        }
      }
      if (!this.local.getRefreshToken()) {
        this.local.clearTokens();
        return of(false);
      }
      return this.refreshToken().pipe(map(() => true));
    });
  }

  override logout(): Observable<void> {
    return defer(() => {
      this.sessionVersion++;
      this.local.clearTokens();
      return of(undefined);
    });
  }

  override refreshToken(): Observable<TokensEntity> {
    if (this.refreshRequest) return this.refreshRequest;
    const token = this.local.getRefreshToken();
    if (!token) {
      this.local.clearTokens();
      return throwError(() => new SessionExpiredError());
    }
    const version = this.sessionVersion;
    this.refreshRequest = this.remote.refreshToken(token).pipe(
      map((dto) => {
        if (version !== this.sessionVersion)
          throw new SessionExpiredError('errors.auth.session_expired');
        return { accessToken: dto.accessToken, refreshToken: dto.refreshToken };
      }),
      tap((entity) => {
        if (version === this.sessionVersion)
          this.local.saveTokens(this.tokensDboMapper.mapTo(entity));
      }),
      catchError((err: unknown) => {
        if (err instanceof UnauthorizedError || err instanceof BadRequestError) {
          if (version === this.sessionVersion) this.local.clearTokens();
          return throwError(
            () => new SessionExpiredError('errors.auth.session_expired', undefined, { cause: err }),
          );
        }
        return throwError(() => (err instanceof AppError ? err : toAppError(err, 'errors.server')));
      }),
      finalize(() => {
        this.refreshRequest = undefined;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.refreshRequest;
  }
}
