import { describe, it, expect } from 'vitest';
import {
  AppError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  ServerError,
} from 'src/core/errors/app-error';

describe('AppError', () => {
  it('stores messageKey', () => {
    const err = new AppError('errors.unknown');
    expect(err.messageKey).toBe('errors.unknown');
    expect(err.message).toBe('errors.unknown');
  });

  it('stores optional context', () => {
    const err = new AppError('errors.unknown', { detail: 'foo' });
    expect(err.context).toEqual({ detail: 'foo' });
  });

  it('is an instance of Error', () => {
    expect(new AppError('key')).toBeInstanceOf(Error);
  });
});

describe('AppError subclasses', () => {
  it('NetworkError is AppError', () => {
    const err = new NetworkError('errors.network');
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(NetworkError);
  });

  it('NotFoundError is AppError', () => {
    const err = new NotFoundError('errors.not_found');
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(NotFoundError);
  });

  it('UnauthorizedError is AppError', () => {
    const err = new UnauthorizedError('errors.unauthorized');
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(UnauthorizedError);
  });

  it('ServerError is AppError', () => {
    const err = new ServerError('errors.server');
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(ServerError);
  });
});
