import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from 'src/presentation/app/app.config';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { ProductDetailView } from '@views/product-detail-view/product-detail-view';
import { environment } from 'src/core/config/environments/environment';
import { authRepository, product } from '../fixtures';

describe('Application composition and routing', () => {
  let controller: HttpTestingController;
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        provideHttpClientTesting(),
        { provide: AuthRepository, useValue: authRepository() },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { common: { back: 'Products' } });
    controller
      .match('/assets/i18n/en.json')
      .forEach((req) => req.flush({ common: { back: 'Products' } }));
  });
  afterEach(() => controller.verify());
  it('reloads the same detail component when only the route ID changes', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/1');
    const first = harness.routeDebugElement?.query(
      By.directive(ProductDetailView),
    ).componentInstance;
    controller.expectOne(`${environment.apiBaseUrl}/products/1`).flush(product);
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain(product.title);
    await harness.navigateByUrl('/products/2');
    const second = harness.routeDebugElement?.query(
      By.directive(ProductDetailView),
    ).componentInstance;
    controller
      .expectOne(`${environment.apiBaseUrl}/products/2`)
      .flush({ ...product, id: 2, title: 'Second product' });
    harness.detectChanges();
    expect(first).toBe(second);
    expect(harness.routeNativeElement?.textContent).toContain('Second product');
  });
  it('redirects anonymous cart navigation to login', async () => {
    TestBed.inject(AuthRepository).restoreSession = () => of(false);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/cart');
    expect(harness.routeNativeElement?.querySelector('app-login-form')).toBeTruthy();
  });

  it('shows a detail skeleton until the response and inserts content without a timer', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/1');
    expect(
      harness.routeNativeElement?.querySelector('app-product-detail-skeleton [role="status"]'),
    ).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('app-product-info')).toBeNull();

    controller.expectOne(`${environment.apiBaseUrl}/products/1`).flush(product);
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('app-product-detail-skeleton')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('app-product-info')?.textContent).toContain(
      product.title,
    );
    expect(harness.routeNativeElement?.querySelector('main')?.getAttribute('aria-busy')).toBe(
      'false',
    );
  });
});
