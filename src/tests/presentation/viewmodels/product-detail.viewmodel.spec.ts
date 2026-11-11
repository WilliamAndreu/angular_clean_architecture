import { provideErrorHandling } from '@di/error/error-handling.di';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { of, Subject, throwError } from 'rxjs';
import { ProductEntity } from '@models/products/product-entity.model';
import { GetProductUseCase } from '@usecases/products/get-product.usecase';
import { ChangeCartItemUseCase } from '@usecases/cart/change-cart-item.usecase';
import { RestoreSessionUseCase } from '@usecases/auth/restore-session.usecase';
import { ProductDetailViewModel } from '@views/product-detail-view/viewmodel/product-detail.viewmodel';
import { AppError } from 'src/domain/errors/app-error';
import { product } from '../../fixtures';
describe('ProductDetailViewModel', () => {
  const execute = vi.fn();
  let vm: ProductDetailViewModel;
  beforeEach(() => {
    execute.mockReset().mockReturnValue(of(product));
    TestBed.configureTestingModule({
      providers: [
        provideErrorHandling(),
        ProductDetailViewModel,
        { provide: GetProductUseCase, useValue: { execute } },
        { provide: ChangeCartItemUseCase, useValue: { execute: vi.fn() } },
        { provide: RestoreSessionUseCase, useValue: { execute: () => of(true) } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });
    vm = TestBed.inject(ProductDetailViewModel);
  });
  it('loads a product and resets the gallery when the route changes', () => {
    vm.load(1);
    vm.setActiveImage(1);
    vm.load(2);
    expect(vm.viewState.activeImage()).toBe(0);
    expect(execute).toHaveBeenLastCalledWith(2);
  });
  it('cancels stale product requests', () => {
    const stale = new Subject<ProductEntity>();
    execute.mockReturnValue(stale);
    vm.load(1);
    execute.mockReturnValue(of({ ...product, id: 2 }));
    vm.load(2);
    stale.next(product);
    expect(vm.viewState.product()?.id).toBe(2);
  });
  it('clears stale product data when loading fails', () => {
    vm.load(1);
    execute.mockReturnValue(throwError(() => new AppError('errors.products.not_found')));
    vm.load(2);
    expect(vm.viewState.product()).toBeNull();
    expect(vm.viewState.error()).toBe('errors.products.not_found');
    expect(vm.viewState.isLoading()).toBe(false);
  });
  it.each([NaN, -1, 0, 1.5])('rejects invalid route ID %s', (id) => {
    vm.load(id);
    expect(execute).not.toHaveBeenCalled();
    expect(vm.viewState.error()).toBe('errors.products.not_found');
  });
  it('ignores image indexes outside the product gallery', () => {
    vm.load(1);
    vm.setActiveImage(99);
    expect(vm.viewState.activeImage()).toBe(0);
  });
});
