import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { provideAuthDI } from '@di/auth/auth.di';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { AuthLocalDataSource } from 'src/data/datasource/auth/source/auth-local.source';
import { AuthRemoteDataSource } from 'src/data/datasource/auth/source/auth-remote.source';
import { UnauthorizedError, NetworkError, BadRequestError } from 'src/domain/errors/app-error';
import { TokensEntity } from '@models/auth/auth-entity.model';
import { user } from '../../fixtures';
describe('AuthRepositoryImp', () => {
  const local = {
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    saveTokens: vi.fn(),
    clearTokens: vi.fn(),
  };
  const remote = { login: vi.fn(), getAuthUser: vi.fn(), refreshToken: vi.fn() };
  let repo: AuthRepository;
  beforeEach(() => {
    vi.resetAllMocks();
    local.getRefreshToken.mockReturnValue('refresh');
    TestBed.configureTestingModule({
      providers: [
        provideAuthDI(),
        { provide: AuthLocalDataSource, useValue: local },
        { provide: AuthRemoteDataSource, useValue: remote },
      ],
    });
    repo = TestBed.inject(AuthRepository);
  });
  it('maps login DTO and stores tokens', async () => {
    remote.login.mockReturnValue(of({ ...user, accessToken: 'access', refreshToken: 'refresh' }));
    const result = await firstValueFrom(repo.login({ username: 'emilys', password: 'secret' }));
    expect(result.user).toEqual(user);
    expect(local.saveTokens).toHaveBeenCalledWith({
      accessToken: 'access',
      refreshToken: 'refresh',
    });
    expect(remote.login).toHaveBeenCalledWith({
      username: 'emilys',
      password: 'secret',
      expiresInMins: 60,
    });
  });
  it('maps invalid credentials', async () => {
    remote.login.mockReturnValue(throwError(() => new BadRequestError('errors.unknown')));
    await expect(
      firstValueFrom(repo.login({ username: 'x', password: 'x' })),
    ).rejects.toMatchObject({ messageKey: 'errors.auth.invalid_credentials' });
  });
  it('shares a single refresh request between concurrent consumers', async () => {
    const response = new Subject<TokensEntity>();
    remote.refreshToken.mockReturnValue(response);
    const first = firstValueFrom(repo.refreshToken());
    const second = firstValueFrom(repo.refreshToken());
    response.next({ accessToken: 'a', refreshToken: 'r' });
    response.complete();
    expect(await first).toEqual(await second);
    expect(remote.refreshToken).toHaveBeenCalledOnce();
    expect(local.saveTokens).toHaveBeenCalledOnce();
  });
  it('discards invalid refresh tokens', async () => {
    remote.refreshToken.mockReturnValue(
      throwError(() => new UnauthorizedError('errors.unauthorized')),
    );
    await expect(firstValueFrom(repo.refreshToken())).rejects.toMatchObject({
      messageKey: 'errors.auth.session_expired',
    });
    expect(local.clearTokens).toHaveBeenCalled();
  });
  it('preserves session credentials on transient network errors', async () => {
    remote.refreshToken.mockReturnValue(throwError(() => new NetworkError('errors.network')));
    await expect(firstValueFrom(repo.refreshToken())).rejects.toBeInstanceOf(NetworkError);
    expect(local.clearTokens).not.toHaveBeenCalled();
  });
  it('does not refresh a token that remains valid', async () => {
    local.getAccessToken.mockReturnValue(
      `header.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.signature`,
    );
    expect(await firstValueFrom(repo.restoreSession())).toBe(true);
    expect(remote.refreshToken).not.toHaveBeenCalled();
  });
  it('refreshes expired access tokens', async () => {
    local.getAccessToken.mockReturnValue(`header.${btoa(JSON.stringify({ exp: 1 }))}.signature`);
    remote.refreshToken.mockReturnValue(of({ accessToken: 'a', refreshToken: 'r' }));
    expect(await firstValueFrom(repo.restoreSession())).toBe(true);
    expect(remote.refreshToken).toHaveBeenCalledWith('refresh');
  });
  it('clears orphan access tokens when no refresh token exists', async () => {
    local.getAccessToken.mockReturnValue('broken');
    local.getRefreshToken.mockReturnValue(null);
    expect(await firstValueFrom(repo.restoreSession())).toBe(false);
    expect(local.clearTokens).toHaveBeenCalled();
  });
  it('does not resurrect a session after logout during refresh', async () => {
    const response = new Subject<TokensEntity>();
    remote.refreshToken.mockReturnValue(response);
    const pending = firstValueFrom(repo.refreshToken());
    const rejected = expect(pending).rejects.toMatchObject({
      messageKey: 'errors.auth.session_expired',
    });
    await firstValueFrom(repo.logout());
    response.next({ accessToken: 'a', refreshToken: 'r' });
    response.complete();
    await rejected;
    expect(local.saveTokens).not.toHaveBeenCalled();
  });
});
