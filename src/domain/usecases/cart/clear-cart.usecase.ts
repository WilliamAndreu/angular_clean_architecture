import { handleOperation } from 'src/domain/errors/handle-operation';
import { Observable, switchMap } from 'rxjs';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { CartRepository } from '@repositories/cart/cart.repository';
import { UseCase } from 'src/domain/interfaces/use-case';
export class ClearCartUseCase implements UseCase<void, void> {
  constructor(
    private readonly auth: AuthRepository,
    private readonly carts: CartRepository,
  ) {}
  execute(): Observable<void> {
    return handleOperation(() =>
      this.auth.getAuthUser().pipe(
        switchMap((user) => this.carts.getCart(user.id)),
        switchMap((cart) => this.carts.clearCart(cart)),
      ),
    );
  }
}
