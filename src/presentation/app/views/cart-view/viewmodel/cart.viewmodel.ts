import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetCartUseCase } from '@usecases/cart/get-cart.usecase';
import { ChangeCartItemUseCase } from '@usecases/cart/change-cart-item.usecase';
import { ClearCartUseCase } from '@usecases/cart/clear-cart.usecase';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';
import { ViewState } from 'src/core/models/types/view/view-state.type';
import { CartState } from './cart.state';

@Injectable()
export class CartViewModel {
  private readonly getCart = inject(GetCartUseCase);
  private readonly changeItem = inject(ChangeCartItemUseCase);
  private readonly clearCart = inject(ClearCartUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly errors = inject(ErrorHandlingSource);
  private readonly state = new CartState();

  readonly viewState: ViewState<CartState> = this.state;

  load(): void {
    if (this.state.isBusy()) return;
    this.state.isLoading.set(true);
    this.state.error.set(null);
    this.getCart
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cart) => {
          this.state.cart.set(cart);
          this.state.isLoading.set(false);
        },
        error: (error: unknown) => this.fail(error, 'cart.load'),
      });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (this.state.isBusy() || !this.state.cart()) return;
    this.state.isSaving.set(true);
    this.state.error.set(null);
    this.changeItem
      .execute({ productId, quantity, mode: 'replace' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cart) => {
          this.state.cart.set(cart);
          this.state.isSaving.set(false);
        },
        error: (error: unknown) => this.fail(error, 'cart.update'),
      });
  }

  clear(): void {
    if (this.state.isBusy() || !this.state.cart()) return;
    this.state.isSaving.set(true);
    this.state.error.set(null);
    this.clearCart
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.cart.set(null);
          this.state.isSaving.set(false);
        },
        error: (error: unknown) => this.fail(error, 'cart.clear'),
      });
  }

  private fail(error: unknown, operation: string): void {
    this.state.error.set(this.errors.handle(error, { source: 'operation', operation }).messageKey);
    this.state.isLoading.set(false);
    this.state.isSaving.set(false);
  }
}
