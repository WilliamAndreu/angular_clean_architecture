import { inject, Injectable } from '@angular/core';
import { Observable, of, map, tap, defer } from 'rxjs';
import { CartEntity, createCart } from '@models/cart/cart.model';
import { CartRepository } from '@repositories/cart/cart.repository';
import { CartLocalDataSource } from 'src/data/datasource/cart/source/cart-local.source';
import { CartRemoteDataSource } from 'src/data/datasource/cart/source/cart-remote.source';
import { CartMapperImp } from 'src/data/repositories/cart/cart.mapper.imp';
@Injectable()
export class CartRepositoryImp extends CartRepository {
  private readonly local = inject(CartLocalDataSource);
  private readonly remote = inject(CartRemoteDataSource);
  private readonly mapper = new CartMapperImp();
  override getCart(userId: number): Observable<CartEntity> {
    return defer(() => {
      const cached = this.local.get(userId);
      return cached
        ? of(this.mapper.fromDbo(cached))
        : this.remote.getByUser(userId).pipe(
            map((page) =>
              page.carts[0] ? this.mapper.fromDto(page.carts[0]) : createCart(userId, []),
            ),
            tap((cart) => this.local.save(this.mapper.toDbo(cart, false))),
          );
    });
  }
  override saveCart(cart: CartEntity): Observable<CartEntity> {
    return defer(() => {
      const simulated = this.local.get(cart.userId)?.simulated ?? false;
      const id = simulated ? undefined : cart.id;
      // DummyJSON does not persist writes. Existing server carts can be updated;
      // simulated IDs must be recreated via POST on subsequent submissions.
      return this.remote.save(this.mapper.toDto(cart), id).pipe(
        map((dto) => createCart(cart.userId, cart.items, dto.id)),
        tap((saved) => this.local.save(this.mapper.toDbo(saved, id === undefined))),
      );
    });
  }
  override clearCart(cart: CartEntity): Observable<void> {
    return defer(() => {
      const simulated = this.local.get(cart.userId)?.simulated ?? false;
      return (
        cart.id !== undefined && !simulated ? this.remote.delete(cart.id) : of(undefined)
      ).pipe(
        map(() => undefined),
        tap(() => this.local.save(this.mapper.toDbo(createCart(cart.userId, []), true))),
      );
    });
  }
}
