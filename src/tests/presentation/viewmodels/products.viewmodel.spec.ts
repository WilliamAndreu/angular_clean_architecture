import { provideErrorHandling } from '@di/error/error-handling.di';
import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { of, Subject, throwError } from 'rxjs';
import { GetProductsUseCase } from '@usecases/products/get-products.usecase';
import { GetCategoriesUseCase } from '@usecases/products/get-categories.usecase';
import { ProductsViewModel } from '@views/products-list-view/viewmodel/products.viewmodel';
import { ProductsEntity } from '@models/products/product-entity.model';
import { AppError } from 'src/domain/errors/app-error';
import { page, product } from '../../fixtures';
describe('ProductsViewModel', () => {
  const execute = vi.fn();
  let vm: ProductsViewModel;
  beforeEach(() => {
    vi.useFakeTimers();
    execute.mockReset().mockReturnValue(of(page));
    TestBed.configureTestingModule({
      providers: [
        provideErrorHandling(),
        ProductsViewModel,
        { provide: GetProductsUseCase, useValue: { execute } },
        { provide: GetCategoriesUseCase, useValue: { execute: () => of([]) } },
      ],
    });
    vm = TestBed.inject(ProductsViewModel);
  });
  afterEach(() => vi.useRealTimers());
  it('loads pages and preserves previous products', () => {
    vm.init();
    execute.mockReturnValue(of({ ...page, skip: 20, products: [{ ...product, id: 2 }] }));
    vm.loadMore();
    expect(vm.viewState.products().map((p) => p.id)).toEqual([1, 2]);
    expect(execute).toHaveBeenLastCalledWith(expect.objectContaining({ skip: 20 }));
  });
  it('debounces search and sends it to the use case', () => {
    vm.init();
    vm.updateSearchTerm('p');
    vm.updateSearchTerm('phone');
    expect(execute).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(300);
    expect(execute).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'phone', skip: 0 }));
  });
  it('cancels outdated requests', () => {
    const stale = new Subject<ProductsEntity>();
    execute.mockReturnValue(stale);
    vm.init();
    execute.mockReturnValue(of({ ...page, products: [{ ...product, id: 2 }] }));
    vm.updateCategory('beauty');
    stale.next(page);
    expect(vm.viewState.products()[0].id).toBe(2);
  });
  it('does not duplicate concurrent pagination requests', () => {
    vm.init();
    execute.mockReturnValue(new Subject<ProductsEntity>());
    vm.loadMore();
    vm.loadMore();
    expect(execute).toHaveBeenCalledTimes(2);
  });
  it('keeps loaded products and retries the failed page', () => {
    vm.init();
    execute.mockReturnValue(throwError(() => new AppError('errors.network')));
    vm.loadMore();
    expect(vm.viewState.products()).toEqual(page.products);
    expect(vm.viewState.error()).toBe('errors.network');
    execute.mockReturnValue(of({ ...page, skip: 20 }));
    vm.retry();
    expect(execute).toHaveBeenLastCalledWith(expect.objectContaining({ skip: 20 }));
    expect(vm.viewState.error()).toBeNull();
  });
});
