import { HttpErrorResponse } from '@angular/common/http';
import { describe, it, expect } from 'vitest';
import { HttpErrorMapperImp } from 'src/core/mappers/error/http-error.mapper.imp';
import { InsufficientStockError } from 'src/domain/errors/cart/cart.errors';
const mapper = new HttpErrorMapperImp();
describe('HttpErrorMapperImp', () => {
  it.each([
    [0, 'NETWORK', 'network', true],
    [400, 'VALIDATION', 'validation', false],
    [422, 'VALIDATION', 'validation', false],
    [401, 'UNAUTHENTICATED', 'authentication', false],
    [403, 'FORBIDDEN', 'authorization', false],
    [404, 'NOT_FOUND', 'not-found', false],
    [408, 'TIMEOUT', 'timeout', true],
    [504, 'TIMEOUT', 'timeout', true],
    [409, 'CONFLICT', 'conflict', false],
    [429, 'RATE_LIMIT', 'rate-limit', true],
    [500, 'SERVER', 'server', true],
    [503, 'SERVER', 'server', true],
    [418, 'UNEXPECTED', 'unexpected', false],
  ])('maps status %s to %s', (status, code, kind, retryable) => {
    const response = new HttpErrorResponse({
      status: status as number,
      error: { message: 'private backend text' },
      url: 'https://example.com/?token=secret',
    });
    const failure = mapper.map(response);
    expect(failure).toMatchObject({ code, kind, retryable, cause: response });
    expect(failure.message).not.toContain('private');
    expect(failure.message).not.toContain('secret');
  });
  it('preserves domain identity instead of remapping business errors', () => {
    const failure = new InsufficientStockError();
    expect(mapper.map(failure)).toBe(failure);
  });
  it('normalizes non-HTTP failures as unexpected', () => {
    const original = new TypeError('bug');
    expect(mapper.map(original)).toMatchObject({ kind: 'unexpected', cause: original });
  });
});
