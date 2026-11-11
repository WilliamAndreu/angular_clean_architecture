import { Observable } from 'rxjs';
import { CartEntity } from '@models/cart/cart.model';
export abstract class CartRepository {
  abstract getCart(userId: number): Observable<CartEntity>;
  abstract saveCart(cart: CartEntity): Observable<CartEntity>;
  abstract clearCart(cart: CartEntity): Observable<void>;
}
