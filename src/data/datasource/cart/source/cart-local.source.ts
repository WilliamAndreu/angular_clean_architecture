import { CartDbo } from '../local/dbo/cart.dbo';
export abstract class CartLocalDataSource {
  abstract get(userId: number): CartDbo | null;
  abstract save(cart: CartDbo): void;
}
