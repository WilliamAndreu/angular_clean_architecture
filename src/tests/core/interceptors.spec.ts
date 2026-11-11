import { provideErrorHandling } from '@di/error/error-handling.di';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { firstValueFrom, throwError } from 'rxjs';
import { authInterceptor } from '@interceptors/auth.interceptor';
import { publicInterceptor } from '@interceptors/public.interceptor';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { environment } from 'src/core/config/environments/environment';
import { SessionExpiredError } from 'src/domain/errors/auth/auth.errors';
import { NetworkError } from 'src/domain/errors/app-error';
import { authRepository } from '../fixtures';
describe('HTTP interceptors', () => {
  let auth: ReturnType<typeof authRepository>;
  let http: HttpClient;
  let controller: HttpTestingController;
  const router = { navigate: vi.fn() };
  beforeEach(() => {
    auth = authRepository();
    router.navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideErrorHandling(),
        provideHttpClient(withInterceptors([publicInterceptor, authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthRepository, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });
  afterEach(() => controller.verify());
  it('does not send credentials to external URLs or translation assets', async () => {
    for (const url of [
      'https://example.com/data',
      '/assets/i18n/en.json',
      'https://dummyjson.com.evil.example/data',
    ]) {
      const response = firstValueFrom(http.get(url));
      const req = controller.expectOne(url);
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
      await response;
    }
  });
  it('does not intercept login or refresh as protected requests', async () => {
    const response = firstValueFrom(http.post(`${environment.apiBaseUrl}/auth/login`, {}));
    const req = controller.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
    await response;
  });
  it('refreshes on 401 and retries the original request once', async () => {
    const url = `${environment.apiBaseUrl}/auth/me`;
    const response = firstValueFrom(http.get(url));
    const initial = controller.expectOne(url);
    expect(initial.request.headers.get('Authorization')).toBe('Bearer access');
    initial.flush({}, { status: 401, statusText: 'Unauthorized' });
    const retry = controller.expectOne(url);
    expect(retry.request.headers.get('Authorization')).toBe('Bearer new-access');
    retry.flush({ id: 1 });
    expect(await response).toEqual({ id: 1 });
    expect(auth.refreshToken).toHaveBeenCalledOnce();
  });
  it('logs out after a failed refresh', async () => {
    auth.refreshToken.mockReturnValue(
      throwError(() => new SessionExpiredError('errors.auth.session_expired')),
    );
    const url = `${environment.apiBaseUrl}/auth/me`;
    const response = firstValueFrom(http.get(url));
    const rejected = expect(response).rejects.toBeDefined();
    controller.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
    await rejected;
    expect(auth.logout).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
  it('preserves credentials after a temporary refresh failure', async () => {
    auth.refreshToken.mockReturnValue(throwError(() => new NetworkError('errors.network')));
    const url = `${environment.apiBaseUrl}/auth/me`;
    const response = firstValueFrom(http.get(url));
    const rejected = expect(response).rejects.toBeDefined();
    controller.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
    await rejected;
    expect(auth.logout).not.toHaveBeenCalled();
  });
  it('never loops when the retry also returns 401', async () => {
    const url = `${environment.apiBaseUrl}/auth/me`;
    const response = firstValueFrom(http.get(url));
    const rejected = expect(response).rejects.toBeDefined();
    controller.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
    controller.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
    await rejected;
    expect(auth.refreshToken).toHaveBeenCalledOnce();
    expect(auth.logout).toHaveBeenCalledOnce();
  });
});
