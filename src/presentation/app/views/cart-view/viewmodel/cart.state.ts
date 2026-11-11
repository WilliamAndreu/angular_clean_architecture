import { computed, signal } from '@angular/core';
import { CartEntity } from '@models/cart/cart.model';

export class CartState {
  readonly cart = signal<CartEntity | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);
  readonly isBusy = computed(() => this.isLoading() || this.isSaving());
}
