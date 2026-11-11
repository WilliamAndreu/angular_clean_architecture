import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Observable, of, Subject, throwError } from 'rxjs';
import { CartEntity, createCart } from '@models/cart/cart.model';
import { GetCartUseCase } from '@usecases/cart/get-cart.usecase';
import { ChangeCartItem, ChangeCartItemUseCase } from '@usecases/cart/change-cart-item.usecase';
import { ClearCartUseCase } from '@usecases/cart/clear-cart.usecase';
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
const updatedCart = createCart(1, [{ ...cart.items[0], quantity: 2 }], 7);

describe('CartViewModel', () => {
  const getCart = { execute: vi.fn<() => Observable<CartEntity>>() };
  const changeItem = { execute: vi.fn<(input: ChangeCartItem) => Observable<CartEntity>>() };
  const clearCart = { execute: vi.fn<() => Observable<void>>() };
  const errors = { handle: vi.fn((error: unknown) => toAppError(error)) };
  let vm: CartViewModel;
  beforeEach(() => {
    vi.resetAllMocks();
    getCart.execute.mockReturnValue(of(cart));
    changeItem.execute.mockReturnValue(of(updatedCart));
    clearCart.execute.mockReturnValue(of(undefined));
    errors.handle.mockImplementation((error) => toAppError(error));
    TestBed.configureTestingModule({
      providers: [
        CartViewModel,
        { provide: GetCartUseCase, useValue: getCart },
        { provide: ChangeCartItemUseCase, useValue: changeItem },
        { provide: ClearCartUseCase, useValue: clearCart },
        { provide: ErrorHandlingSource, useValue: errors },
      ],
    });
    vm = TestBed.inject(CartViewModel);
  });

  it('loads the cart and clears loading after success', () => {
    const response = new Subject<CartEntity>();
    getCart.execute.mockReturnValue(response);
    vm.load();
    expect(vm.viewState.isLoading()).toBe(true);
    expect(vm.viewState.cart()).toBeNull();
    response.next(cart);
    expect(vm.viewState.cart()).toEqual(cart);
    expect(vm.viewState.isLoading()).toBe(false);
    expect(vm.viewState.error()).toBeNull();
  });

  it('blocks duplicate loads and modifications during a refresh', () => {
    vm.load();
    getCart.execute.mockReturnValue(new Subject<CartEntity>());
    vm.load();
    vm.load();
    vm.updateQuantity(1, 2);
    vm.clear();
    expect(getCart.execute).toHaveBeenCalledTimes(2);
    expect(changeItem.execute).not.toHaveBeenCalled();
    expect(clearCart.execute).not.toHaveBeenCalled();
  });

  it('updates a quantity through the use case', () => {
    vm.load();
    vm.updateQuantity(1, 2);
    expect(changeItem.execute).toHaveBeenCalledWith({ productId: 1, quantity: 2, mode: 'replace' });
    expect(vm.viewState.cart()).toEqual(updatedCart);
    expect(vm.viewState.isSaving()).toBe(false);
  });

  it('blocks concurrent writes and loads while saving', () => {
    vm.load();
    const response = new Subject<CartEntity>();
    changeItem.execute.mockReturnValue(response);
    vm.updateQuantity(1, 2);
    vm.updateQuantity(1, 3);
    vm.clear();
    vm.load();
    expect(vm.viewState.isSaving()).toBe(true);
    expect(changeItem.execute).toHaveBeenCalledOnce();
    expect(clearCart.execute).not.toHaveBeenCalled();
    expect(getCart.execute).toHaveBeenCalledOnce();
    response.next(updatedCart);
    expect(vm.viewState.isBusy()).toBe(false);
  });

  it('clears the cart through its use case', () => {
    vm.load();
    const response = new Subject<void>();
    clearCart.execute.mockReturnValue(response);
    vm.clear();
    expect(vm.viewState.cart()).toEqual(cart);
    expect(vm.viewState.isSaving()).toBe(true);
    response.next();
    expect(vm.viewState.cart()).toBeNull();
    expect(vm.viewState.isSaving()).toBe(false);
  });

  it('retains existing data when a refresh fails', () => {
    vm.load();
    getCart.execute.mockReturnValue(throwError(() => new NetworkError()));
    vm.load();
    expect(vm.viewState.cart()).toEqual(cart);
    expect(vm.viewState.error()).toBe('errors.network');
    expect(vm.viewState.isBusy()).toBe(false);
    expect(errors.handle).toHaveBeenCalledWith(expect.any(NetworkError), {
      source: 'operation',
      operation: 'cart.load',
    });
  });

  it('retains existing data and reports a failed modification', () => {
    vm.load();
    changeItem.execute.mockReturnValue(throwError(() => new NetworkError()));
    vm.updateQuantity(1, 2);
    expect(vm.viewState.cart()).toEqual(cart);
    expect(vm.viewState.error()).toBe('errors.network');
    expect(vm.viewState.isBusy()).toBe(false);
    expect(errors.handle).toHaveBeenCalledWith(expect.any(NetworkError), {
      source: 'operation',
      operation: 'cart.update',
    });
  });

  it('retains existing data when clearing fails', () => {
    vm.load();
    clearCart.execute.mockReturnValue(throwError(() => new NetworkError()));
    vm.clear();
    expect(vm.viewState.cart()).toEqual(cart);
    expect(vm.viewState.error()).toBe('errors.network');
    expect(vm.viewState.isSaving()).toBe(false);
    expect(errors.handle).toHaveBeenCalledWith(expect.any(NetworkError), {
      source: 'operation',
      operation: 'cart.clear',
    });
  });

  it('clears the error when loading again', () => {
    getCart.execute.mockReturnValueOnce(throwError(() => new NetworkError()));
    vm.load();
    vm.load();
    expect(vm.viewState.cart()).toEqual(cart);
    expect(vm.viewState.error()).toBeNull();
  });

  it('does not submit modifications without a loaded cart', () => {
    vm.updateQuantity(1, 2);
    vm.clear();
    expect(changeItem.execute).not.toHaveBeenCalled();
    expect(clearCart.execute).not.toHaveBeenCalled();
  });

  it('cancels the subscription when the ViewModel is destroyed', () => {
    const cancelled = vi.fn();
    const response = new Subject<CartEntity>();
    getCart.execute.mockReturnValue(
      new Observable((subscriber) => {
        const subscription = response.subscribe(subscriber);
        return () => {
          cancelled();
          subscription.unsubscribe();
        };
      }),
    );
    vm.load();
    TestBed.resetTestingModule();
    response.next(cart);
    expect(cancelled).toHaveBeenCalledOnce();
    expect(vm.viewState.cart()).toBeNull();
  });
});
