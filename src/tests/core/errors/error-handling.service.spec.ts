import { provideErrorHandling } from '@di/error/error-handling.di';
import { ErrorReporterSource } from 'src/core/services/error-reporting/source/error-reporter.source';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import {
  AppError,
  BadRequestError,
  NetworkError,
  ServerError,
  UnexpectedError,
} from 'src/domain/errors/app-error';
import { ErrorHandlingServiceImp } from 'src/core/services/error-handling/error-handling.service.imp';
import { ERROR_DIAGNOSTICS } from 'src/core/config/tokens/error/error-handling.tokens';
import { ERROR_REPORT_POLICY } from 'src/core/config/tokens/error/error-handling.tokens';

describe('ErrorHandlingServiceImp', () => {
  const reporter = { report: vi.fn<ErrorReporterSource['report']>() };
  beforeEach(() => {
    TestBed.resetTestingModule();
    reporter.report.mockReset();
    TestBed.configureTestingModule({
      providers: [provideErrorHandling({ reporter })],
    });
  });
  it('returns expected business failures without reporting them', () => {
    const service = TestBed.inject(ErrorHandlingServiceImp);
    for (const failure of [new BadRequestError(), new NetworkError()])
      expect(service.handle(failure)).toBe(failure);
    expect(reporter.report).not.toHaveBeenCalled();
  });
  it('normalizes arbitrary thrown values without displaying them', () => {
    const service = TestBed.inject(ErrorHandlingServiceImp);
    for (const raw of [null, undefined, 'token=secret', { password: 'secret' }, 42]) {
      const failure = service.handle(raw);
      expect(failure).toBeInstanceOf(UnexpectedError);
      expect(failure.messageKey).toBe('errors.unknown');
      expect(failure.cause).toBe(raw);
    }
    expect(reporter.report).toHaveBeenCalledTimes(5);
  });
  it('reports server failures with only approved fields', () => {
    const original = new Error('password=secret https://example.com/?token=secret');
    const failure = new ServerError('errors.server', { token: 'secret' }, { cause: original });
    TestBed.inject(ErrorHandlingServiceImp).handle(failure, {
      source: 'operation',
      operation: 'products.load',
    });
    const event = reporter.report.mock.calls[0][0];
    expect(event).toEqual({
      code: 'SERVER',
      kind: 'server',
      source: 'operation',
      operation: 'products.load',
      timestamp: expect.any(String),
    });
    expect(JSON.stringify(event)).not.toContain('secret');
    expect(Object.isFrozen(event)).toBe(true);
    expect(failure.cause).toBe(original);
  });
  it('deduplicates wrapped causes across local and global handling', () => {
    const original = new Error('bug');
    const service = TestBed.inject(ErrorHandlingServiceImp);
    service.handle(original, { source: 'operation' });
    service.handle(original, { source: 'global' });
    service.handle(new UnexpectedError(undefined, undefined, { cause: original }), {
      source: 'global',
    });
    expect(reporter.report).toHaveBeenCalledOnce();
  });
  it('does not suppress a separate occurrence with the same code', () => {
    const service = TestBed.inject(ErrorHandlingServiceImp);
    service.handle(new ServerError());
    service.handle(new ServerError());
    expect(reporter.report).toHaveBeenCalledTimes(2);
  });
  it('reports a previously handled expected failure if it later becomes unhandled', () => {
    const failure = new BadRequestError();
    const service = TestBed.inject(ErrorHandlingServiceImp);
    service.handle(failure);
    service.handle(failure, { source: 'global' });
    expect(reporter.report).toHaveBeenCalledOnce();
  });
  it('survives a throwing reporter without losing the original error', () => {
    reporter.report.mockImplementation(() => {
      throw new Error('reporter unavailable');
    });
    const failure = new ServerError();
    expect(TestBed.inject(ErrorHandlingServiceImp).handle(failure)).toBe(failure);
  });
  it('consumes rejected reporter promises', async () => {
    reporter.report.mockImplementation(() => Promise.reject(new Error('reporter unavailable')));
    const failure = new ServerError();
    expect(TestBed.inject(ErrorHandlingServiceImp).handle(failure)).toBe(failure);
    await Promise.resolve();
    await Promise.resolve();
  });
  it('prevents synchronous reporter recursion', () => {
    const service = TestBed.inject(ErrorHandlingServiceImp);
    reporter.report.mockImplementation(() => {
      service.handle(new Error('recursive'), { source: 'global' });
    });
    service.handle(new ServerError());
    expect(reporter.report).toHaveBeenCalledOnce();
  });
  it('handles circular cause chains', () => {
    const failure = new UnexpectedError();
    Object.defineProperty(failure, 'cause', { value: failure });
    expect(() => TestBed.inject(ErrorHandlingServiceImp).handle(failure)).not.toThrow();
    expect(reporter.report).toHaveBeenCalledOnce();
  });
  it('allows project-specific reporting policy', () => {
    TestBed.overrideProvider(ERROR_REPORT_POLICY, {
      useValue: (failure: AppError) => failure.code === 'NETWORK',
    });
    const service = TestBed.inject(ErrorHandlingServiceImp);
    service.handle(new ServerError());
    service.handle(new NetworkError());
    expect(reporter.report).toHaveBeenCalledOnce();
    expect(reporter.report.mock.calls[0][0].code).toBe('NETWORK');
  });
  it('isolates failures in a custom policy', () => {
    TestBed.overrideProvider(ERROR_REPORT_POLICY, {
      useValue: () => {
        throw new Error('broken policy');
      },
    });
    expect(() => TestBed.inject(ErrorHandlingServiceImp).handle(new ServerError())).not.toThrow();
  });
  it('supports explicitly sanitized diagnostics without exposing the original cause', () => {
    TestBed.overrideProvider(ERROR_DIAGNOSTICS, {
      useValue: (failure: AppError) => ({ errorClass: failure.name, release: 'test' }),
    });
    TestBed.inject(ErrorHandlingServiceImp).handle(
      new ServerError(undefined, undefined, { cause: new Error('secret') }),
    );
    const event = reporter.report.mock.calls[0][0];
    expect(event.details).toEqual({ errorClass: 'ServerError', release: 'test' });
    expect(Object.isFrozen(event.details)).toBe(true);
    expect(JSON.stringify(event)).not.toContain('secret');
  });
  it('still reports when optional diagnostics fail', () => {
    TestBed.overrideProvider(ERROR_DIAGNOSTICS, {
      useValue: () => {
        throw new Error('projection failed');
      },
    });
    TestBed.inject(ErrorHandlingServiceImp).handle(new ServerError());
    expect(reporter.report).toHaveBeenCalledOnce();
    expect(reporter.report.mock.calls[0][0].details).toBeUndefined();
  });
});
