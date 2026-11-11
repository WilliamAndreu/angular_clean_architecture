import { describe, it, expect } from 'vitest';
import { firstValueFrom, throwError } from 'rxjs';
import { LoginUseCase } from '@usecases/auth/login.usecase';
import { InvalidCredentialsError } from 'src/domain/errors/auth/auth.errors';
import { AppError } from 'src/domain/errors/app-error';
import { authRepository } from '../../fixtures';
describe('LoginUseCase', () => {
  it('delegates credentials and returns the entity', async () => {
    const repo = authRepository();
    const usecase = new LoginUseCase(repo);
    const credentials = { username: 'emilys', password: 'emilyspass' };
    expect((await firstValueFrom(usecase.execute(credentials))).user.id).toBe(1);
    expect(repo.login).toHaveBeenCalledWith(credentials);
  });
  it('preserves typed credential errors', async () => {
    const repo = authRepository();
    const error = new InvalidCredentialsError('errors.auth.invalid_credentials');
    repo.login.mockReturnValue(throwError(() => error));
    await expect(
      firstValueFrom(new LoginUseCase(repo).execute({ username: 'x', password: 'x' })),
    ).rejects.toBe(error);
  });
  it('normalizes unexpected errors', async () => {
    const repo = authRepository();
    repo.login.mockReturnValue(throwError(() => new Error('unexpected')));
    await expect(
      firstValueFrom(new LoginUseCase(repo).execute({ username: 'x', password: 'x' })),
    ).rejects.toBeInstanceOf(AppError);
  });
});
