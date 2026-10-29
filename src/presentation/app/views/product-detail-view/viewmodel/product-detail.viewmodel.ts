import { ChangeCartItemUseCase } from '@usecases/cart/change-cart-item.usecase';
import { Router } from '@angular/router';
import { RestoreSessionUseCase } from '@usecases/auth/restore-session.usecase';
import { EMPTY, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { ProductDetailState } from './product-detail.state';
import { GetProductUseCase } from '@usecases/products/get-product.usecase';
import { ViewState } from 'src/core/models/types/view/view-state.type';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';

@Injectable()
export class ProductDetailViewModel {
  private readonly getProductUseCase = inject(GetProductUseCase);
  private readonly changeItem = inject(ChangeCartItemUseCase);
  private readonly session = inject(RestoreSessionUseCase);
  private readonly router = inject(Router);
  private readonly errors = inject(ErrorHandlingSource);
  private readonly state = new ProductDetailState();

  private readonly destroyRef = inject(DestroyRef);
  private request?: Subscription;

  readonly viewState: ViewState<ProductDetailState> = this.state;

  load(id: number): void {
    this.request?.unsubscribe();
    this.state.product.set(null);
    this.state.cartMessage.set(null);
    this.state.cartError.set(null);
    this.state.activeImage.set(0);
    if (!Number.isInteger(id) || id < 1) {
      this.state.error.set('errors.products.not_found');
      this.state.isLoading.set(false);
      return;
    }
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.request = this.getProductUseCase
      .execute(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.state.product.set(product);
          this.state.isLoading.set(false);
        },
        error: (err: unknown) => {
          this.state.error.set(
            this.errors.handle(err, { source: 'operation', operation: 'products.detail' })
              .messageKey,
          );
          this.state.isLoading.set(false);
        },
      });
  }

  addToCart(quantity: number): void {
    const product = this.state.product();
    if (!product || this.state.isAdding()) return;
    this.state.isAdding.set(true);
    this.state.cartMessage.set(null);
    this.state.cartError.set(null);
    this.session
      .execute()
      .pipe(
        switchMap((active) => {
          if (!active) {
            void this.router.navigate(['/login']);
            return EMPTY;
          }
          return this.changeItem.execute({ productId: product.id, quantity, mode: 'add' });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.state.cartMessage.set('cart.added'),
        error: (err: unknown) => {
          this.state.cartError.set(
            this.errors.handle(err, { source: 'operation', operation: 'cart.add' }).messageKey,
          );
          this.state.isAdding.set(false);
        },
        complete: () => this.state.isAdding.set(false),
      });
  }

  setActiveImage(index: number): void {
    if (Number.isInteger(index) && index >= 0 && index < (this.state.product()?.images.length ?? 0))
      this.state.activeImage.set(index);
  }
}
