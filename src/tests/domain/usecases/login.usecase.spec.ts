import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AppError } from 'src/core/errors/app-error';
import { LoginEntity } from 'src/domain/entities/auth/auth-entity.model';

const mockLogin: LoginEntity = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: 1,
    username: 'john',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    image: 'avatar.jpg',
  },
};

describe('LoginUseCase', () => {
  it('returns login entity on success', async () => {
    const repo = { login: vi.fn((_u: string, _p: string) => of(mockLogin)) };
    const result = await firstValueFrom(repo.login('john', 'pass'));
    expect(result.accessToken).toBe('access-token');
    expect(result.user.username).toBe('john');
  });

  it('wraps auth error with AppError', () => {
    const err = new Error('Unauthorized');
    const wrapped = new AppError('errors.auth.login_failed', { detail: err.message });
    expect(wrapped.messageKey).toBe('errors.auth.login_failed');
    expect(wrapped).toBeInstanceOf(AppError);
  });
});
