import { handleOperation } from 'src/domain/errors/handle-operation';
import { Observable, switchMap, throwError, map } from 'rxjs';
import { CartEntity, createCart } from '@models/cart/cart.model';
import { CartRepository } from '@repositories/cart/cart.repository';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { ProductsRepository } from '@repositories/products/products.repository';
import {
  InvalidCartQuantityError,
  InsufficientStockError,
  CartItemNotFoundError,
} from 'src/domain/errors/cart/cart.errors';
import { UseCase } from 'src/domain/interfaces/use-case';
export interface ChangeCartItem {
  productId: number;
  quantity: number;
  mode: 'add' | 'replace';
}
export class ChangeCartItemUseCase implements UseCase<ChangeCartItem, CartEntity> {
  constructor(
    private readonly auth: AuthRepository,
    private readonly carts: CartRepository,
    private readonly products: ProductsRepository,
  ) {}
  execute(params: ChangeCartItem): Observable<CartEntity> {
    if (
      !Number.isInteger(params.productId) ||
      params.productId < 1 ||
      !Number.isInteger(params.quantity) ||
      params.quantity < 0 ||
      (params.mode === 'add' && params.quantity === 0)
    )
      return throwError(() => new InvalidCartQuantityError());
    return handleOperation(() =>
      this.auth.getAuthUser().pipe(
        switchMap((user) => this.carts.getCart(user.id)),
        switchMap((cart) => {
          const existing = cart.items.find((item) => item.productId === params.productId);
          if (params.mode === 'replace' && !existing)
            return throwError(() => new CartItemNotFoundError());
          const quantity =
            params.mode === 'add' ? (existing?.quantity ?? 0) + params.quantity : params.quantity;
          const remaining = cart.items.filter((item) => item.productId !== params.productId);
          if (quantity === 0) {
            if (remaining.length === 0)
              return this.carts.clearCart(cart).pipe(map(() => createCart(cart.userId, [])));
            return this.carts.saveCart(createCart(cart.userId, remaining, cart.id));
          }
          return this.products.getProduct(params.productId).pipe(
            switchMap((product) => {
              if (quantity > product.stock) return throwError(() => new InsufficientStockError());
              return this.carts.saveCart(
                createCart(
                  cart.userId,
                  [
                    ...remaining,
                    {
                      productId: product.id,
                      title: product.title,
                      thumbnail: product.thumbnail,
                      price: product.price,
                      discountPercentage: product.discountPercentage,
                      quantity,
                    },
                  ],
                  cart.id,
                ),
              );
            }),
          );
        }),
      ),
    );
  }
}
