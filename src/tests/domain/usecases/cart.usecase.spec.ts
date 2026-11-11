import { SessionExpiredError } from 'src/domain/errors/auth/auth.errors';
import { describe, it, expect } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ChangeCartItemUseCase } from '@usecases/cart/change-cart-item.usecase';
import { GetCartUseCase } from '@usecases/cart/get-cart.usecase';
import { ClearCartUseCase } from '@usecases/cart/clear-cart.usecase';
import { createCart } from '@models/cart/cart.model';
import { authRepository, productsRepository, cartRepository, product } from '../../fixtures';
const line = {
  productId: 1,
  title: product.title,
  thumbnail: product.thumbnail,
  price: 10,
  discountPercentage: 10,
  quantity: 2,
};
function setup() {
  const auth = authRepository();
  const products = productsRepository();
  const carts = cartRepository();
  return { auth, products, carts, usecase: new ChangeCartItemUseCase(auth, carts, products) };
}
describe('Cart use cases', () => {
  it('loads the authenticated user cart', async () => {
    const { auth, carts } = setup();
    await firstValueFrom(new GetCartUseCase(auth, carts).execute());
    expect(carts.getCart).toHaveBeenCalledWith(1);
  });
  it('adds a product and calculates discounted totals in the domain', async () => {
    const { usecase, carts } = setup();
    const result = await firstValueFrom(
      usecase.execute({ productId: 1, quantity: 2, mode: 'add' }),
    );
    expect(result).toMatchObject({ totalQuantity: 2, subtotal: 20, total: 18 });
    expect(carts.saveCart).toHaveBeenCalledOnce();
  });
  it('merges quantities without duplicate lines', async () => {
    const { usecase, carts } = setup();
    carts.getCart.mockReturnValue(of(createCart(1, [line], 7)));
    const result = await firstValueFrom(
      usecase.execute({ productId: 1, quantity: 1, mode: 'add' }),
    );
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(3);
    expect(result.id).toBe(7);
  });
  it.each([-1, 0.5, NaN, Infinity])('rejects invalid quantity %s before I/O', async (quantity) => {
    const { usecase, auth, carts } = setup();
    await expect(
      firstValueFrom(usecase.execute({ productId: 1, quantity, mode: 'add' })),
    ).rejects.toMatchObject({ messageKey: 'errors.cart.invalid_quantity' });
    expect(auth.getAuthUser).not.toHaveBeenCalled();
    expect(carts.saveCart).not.toHaveBeenCalled();
  });
  it('rejects quantities above current stock', async () => {
    const { usecase, carts } = setup();
    await expect(
      firstValueFrom(usecase.execute({ productId: 1, quantity: 6, mode: 'add' })),
    ).rejects.toMatchObject({ messageKey: 'errors.cart.insufficient_stock' });
    expect(carts.saveCart).not.toHaveBeenCalled();
  });
  it('replaces quantity rather than incrementing it', async () => {
    const { usecase, carts } = setup();
    carts.getCart.mockReturnValue(of(createCart(1, [line])));
    expect(
      (await firstValueFrom(usecase.execute({ productId: 1, quantity: 1, mode: 'replace' }))).total,
    ).toBe(9);
  });
  it('removes a line without fetching product stock', async () => {
    const { usecase, carts, products } = setup();
    carts.getCart.mockReturnValue(of(createCart(1, [line])));
    expect(
      (await firstValueFrom(usecase.execute({ productId: 1, quantity: 0, mode: 'replace' }))).items,
    ).toEqual([]);
    expect(products.getProduct).not.toHaveBeenCalled();
  });
  it('does not write after an authentication failure', async () => {
    const { usecase, auth, carts } = setup();
    auth.getAuthUser.mockReturnValue(throwError(() => new SessionExpiredError()));
    await expect(
      firstValueFrom(usecase.execute({ productId: 1, quantity: 1, mode: 'add' })),
    ).rejects.toMatchObject({ code: 'AUTH_SESSION_EXPIRED' });
    expect(carts.saveCart).not.toHaveBeenCalled();
  });
  it('clears the authenticated user cart', async () => {
    const { auth, carts } = setup();
    await firstValueFrom(new ClearCartUseCase(auth, carts).execute());
    expect(carts.clearCart).toHaveBeenCalledWith(createCart(1, []));
  });
  it('rounds monetary totals to cents', () => {
    expect(createCart(1, [{ ...line, price: 0.1, quantity: 3, discountPercentage: 0 }]).total).toBe(
      0.3,
    );
  });
});
