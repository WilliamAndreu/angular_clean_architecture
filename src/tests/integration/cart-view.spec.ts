import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Observable, of, Subject } from 'rxjs';
import { CartEntity, createCart } from '@models/cart/cart.model';
import { GetCartUseCase } from '@usecases/cart/get-cart.usecase';
import { ChangeCartItemUseCase } from '@usecases/cart/change-cart-item.usecase';
import { ClearCartUseCase } from '@usecases/cart/clear-cart.usecase';
import { CartView } from '@views/cart-view/cart-view';
import { CartViewModel } from '@views/cart-view/viewmodel/cart.viewmodel';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';
import { NetworkError, toAppError } from 'src/domain/errors/app-error';

const cart = createCart(
  1,
  [
    {
      productId: 1,
      title: 'Product',
      thumbnail: 'product.jpg',
      price: 10,
      discountPercentage: 0,
      quantity: 1,
    },
  ],
  7,
);

describe('Cart view interactions', () => {
  let updates: Subject<CartEntity>;
  const getCart = { execute: vi.fn<() => Observable<CartEntity>>() };
  const changeItem = { execute: vi.fn<() => Observable<CartEntity>>() };
  beforeEach(() => {
    updates = new Subject<CartEntity>();
    getCart.execute.mockReset().mockReturnValue(of(cart));
    changeItem.execute.mockReset().mockReturnValue(updates);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTranslateService({ lang: 'en' }),
        { provide: GetCartUseCase, useValue: getCart },
        { provide: ChangeCartItemUseCase, useValue: changeItem },
        { provide: ClearCartUseCase, useValue: { execute: () => of(undefined) } },
        {
          provide: ErrorHandlingSource,
          useValue: { handle: (error: unknown) => toAppError(error) },
        },
      ],
    });
    TestBed.inject(TranslateService).setTranslation('en', {
      cart: {
        title: 'Cart',
        quantity: 'Quantity',
        update: 'Update',
        remove: 'Remove',
        clear: 'Clear',
        total: 'Total',
        subtotal: 'Subtotal',
      },
      common: { retry: 'Retry' },
      errors: { network: 'Network unavailable' },
    });
  });

  it('preserves cart rows and re-enables actions after a failed modification', async () => {
    const fixture = TestBed.createComponent(CartView);
    const vm = fixture.debugElement.injector.get(CartViewModel);
    fixture.detectChanges();
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const summary = element.querySelector('app-cart-summary');
    const row = element.querySelector('li');
    const updateButton = Array.from(
      element.querySelectorAll<HTMLButtonElement>('app-cart-items button'),
    ).find((button) => button.textContent?.includes('Update'))!;
    updateButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(vm.viewState.isSaving()).toBe(true);
    expect(updateButton.disabled).toBe(true);
    expect(element.querySelector('li')).toBe(row);
    expect(element.querySelector('app-cart-summary')).toBe(summary);

    updates.error(new NetworkError());
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('li')).toBe(row);
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Network unavailable');
    expect(updateButton.disabled).toBe(false);
  });

  it('updates totals after success while preserving the row DOM identity', async () => {
    const fixture = TestBed.createComponent(CartView);
    const vm = fixture.debugElement.injector.get(CartViewModel);
    fixture.detectChanges();
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const row = element.querySelector('li');
    vm.updateQuantity(1, 2);
    updates.next(createCart(1, [{ ...cart.items[0], quantity: 2 }], 7));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('app-cart-summary')?.textContent).toContain('$20.00');
    expect(element.querySelector('li')).toBe(row);
  });

  it('replaces the initial skeleton with cart content as soon as data arrives', async () => {
    const loading = new Subject<CartEntity>();
    getCart.execute.mockReturnValue(loading);
    const fixture = TestBed.createComponent(CartView);
    fixture.detectChanges();
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('app-cart-skeleton [role="status"]')).toBeTruthy();
    expect(element.querySelector('app-cart-skeleton [aria-hidden="true"]')).toBeTruthy();
    expect(element.querySelector('main')?.getAttribute('aria-busy')).toBe('true');
    expect(element.querySelector('app-cart-items')).toBeNull();

    loading.next(cart);
    loading.complete();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('app-cart-skeleton')).toBeNull();
    expect(element.querySelector('app-cart-items li')?.textContent).toContain('Product');
    expect(element.querySelector('main')?.getAttribute('aria-busy')).toBe('false');
  });
});
