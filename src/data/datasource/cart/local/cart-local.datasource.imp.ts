import { inject, Injectable } from '@angular/core';
import { StorageSource } from 'src/core/services/storage/source/storage.source';
import { CartDbo } from 'src/data/datasource/cart/local/dbo/cart.dbo';
import { CartLocalDataSource } from 'src/data/datasource/cart/source/cart-local.source';
@Injectable()
export class CartLocalDataSourceImp extends CartLocalDataSource {
  private readonly storage = inject(StorageSource);
  override get(userId: number): CartDbo | null {
    const cached = this.storage.get<CartDbo>(`cart_v1_${userId}`);
    if (!cached || cached.version !== 1 || cached.userId !== userId || !Array.isArray(cached.items))
      return null;
    if (
      !cached.items.every(
        (item) =>
          Number.isInteger(item.productId) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          Number.isFinite(item.price) &&
          item.price >= 0 &&
          Number.isFinite(item.discountPercentage) &&
          item.discountPercentage >= 0 &&
          item.discountPercentage <= 100 &&
          typeof item.title === 'string' &&
          typeof item.thumbnail === 'string',
      )
    )
      return null;
    return cached;
  }
  override save(cart: CartDbo): void {
    this.storage.set(`cart_v1_${cart.userId}`, cart);
  }
}
