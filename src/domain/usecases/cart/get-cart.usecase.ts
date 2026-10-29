import { handleOperation } from 'src/domain/errors/handle-operation';
import { switchMap, Observable } from 'rxjs';
import { CartEntity } from '@models/cart/cart.model';
import { CartRepository } from '@repositories/cart/cart.repository';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { UseCase } from 'src/domain/interfaces/use-case';
export class GetCartUseCase implements UseCase<void, CartEntity> {
  constructor(
    private readonly auth: AuthRepository,
    private readonly carts: CartRepository,
  ) {}
  execute(): Observable<CartEntity> {
    return handleOperation(() =>
      this.auth.getAuthUser().pipe(switchMap((user) => this.carts.getCart(user.id))),
    );
  }
}
