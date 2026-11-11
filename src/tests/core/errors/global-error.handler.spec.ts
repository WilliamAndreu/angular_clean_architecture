import { ErrorNotificationSource } from 'src/core/services/error-notification/source/error-notification.source';
import { ErrorReporterSource } from 'src/core/services/error-reporting/source/error-reporter.source';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { provideErrorHandling } from '@di/error/error-handling.di';
import { GlobalErrorHandlerImp } from 'src/core/handlers/error/global-error.handler.imp';
import { reportBootstrapError } from 'src/core/utils/error/report-bootstrap-error.util';
import { HttpErrorMapperSource } from 'src/core/mappers/error/source/http-error-mapper.source';
import { ConflictError } from 'src/domain/errors/app-error';

describe('Global error composition', () => {
  const reporter = { report: vi.fn<ErrorReporterSource['report']>() };
  beforeEach(() => {
    reporter.report.mockReset();
    TestBed.configureTestingModule({ providers: [provideErrorHandling({ reporter })] });
  });
  afterEach(() => vi.unstubAllGlobals());
  it('registers the Angular boundary, reports and exposes the notification without UI', () => {
    const handler = TestBed.inject(ErrorHandler);
    expect(handler).toBeInstanceOf(GlobalErrorHandlerImp);
    handler.handleError(new Error('sensitive details'));
    const notification = TestBed.inject(ErrorNotificationSource);
    expect(notification.isVisible()).toBe(true);
    notification.dismiss();
    expect(notification.isVisible()).toBe(false);
    expect(reporter.report).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'global', code: 'UNEXPECTED' }),
    );
  });
  it('unwraps browser ErrorEvents without serializing their content', () => {
    TestBed.inject(ErrorHandler).handleError(
      new ErrorEvent('error', { error: new Error('secret') }),
    );
    expect(reporter.report).toHaveBeenCalledOnce();
    expect(JSON.stringify(reporter.report.mock.calls)).not.toContain('secret');
  });
  it('unwraps unhandled promise rejections', () => {
    class RejectionEvent extends Event {
      constructor(readonly reason: unknown) {
        super('unhandledrejection');
      }
    }
    vi.stubGlobal('PromiseRejectionEvent', RejectionEvent);
    TestBed.inject(ErrorHandler).handleError(new RejectionEvent(new Error('secret')));
    expect(reporter.report).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'unexpected', source: 'global' }),
    );
    expect(JSON.stringify(reporter.report.mock.calls)).not.toContain('secret');
  });
  it('allows replacing only the HTTP mapping adapter', () => {
    TestBed.resetTestingModule();
    const failure = new ConflictError('errors.project.conflict');
    const mapper = { map: () => failure };
    TestBed.configureTestingModule({ providers: [provideErrorHandling({ httpMapper: mapper })] });
    expect(TestBed.inject(HttpErrorMapperSource).map(null)).toBe(failure);
  });
  it('handles bootstrap errors before Angular DI exists', () => {
    reportBootstrapError(new Error('secret'), reporter);
    expect(reporter.report).toHaveBeenCalledWith(expect.objectContaining({ source: 'bootstrap' }));
    expect(JSON.stringify(reporter.report.mock.calls)).not.toContain('secret');
  });
  it('does not rethrow bootstrap reporter failures', async () => {
    expect(() =>
      reportBootstrapError(null, {
        report: () => {
          throw new Error('offline');
        },
      }),
    ).not.toThrow();
    reportBootstrapError(null, { report: () => Promise.reject(new Error('offline')) });
    await Promise.resolve();
    await Promise.resolve();
  });
});
