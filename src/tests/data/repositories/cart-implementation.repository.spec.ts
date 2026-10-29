import { CartLocalDataSourceImp } from 'src/data/datasource/cart/local/cart-local.datasource.imp';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { CartRepositoryImp } from 'src/data/repositories/cart/cart.repository.imp';
import { CartLocalDataSource } from 'src/data/datasource/cart/source/cart-local.source';
import { CartRemoteDataSource } from 'src/data/datasource/cart/source/cart-remote.source';
import { LocalStorageServiceImp } from 'src/core/services/storage/local-storage/local-storage.service.imp';
import { StorageSource } from 'src/core/services/storage/source/storage.source';
import { createCart } from '@models/cart/cart.model';
const line = {
  productId: 1,
  title: 'Product',
  thumbnail: 'image.jpg',
  price: 10,
  discountPercentage: 10,
  quantity: 1,
};
describe('CartRepositoryImp simulation semantics', () => {
  let repo: CartRepositoryImp;
  const remote = { getByUser: vi.fn(), save: vi.fn(), delete: vi.fn() };
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    remote.getByUser.mockReturnValue(of({ carts: [] }));
    remote.save.mockReturnValue(of({ id: 999 }));
    remote.delete.mockReturnValue(of({}));
    TestBed.configureTestingModule({
      providers: [
        CartRepositoryImp,
        { provide: CartLocalDataSource, useClass: CartLocalDataSourceImp },
        { provide: StorageSource, useClass: LocalStorageServiceImp },
        { provide: CartRemoteDataSource, useValue: remote },
      ],
    });
    repo = TestBed.inject(CartRepositoryImp);
  });
  it('never PUTs an ID returned by simulated POST', async () => {
    const first = await firstValueFrom(repo.saveCart(createCart(1, [line])));
    await firstValueFrom(repo.saveCart(first));
    expect(remote.save.mock.calls.map(([, id]) => id)).toEqual([undefined, undefined]);
  });
  it('uses PUT for existing server carts', async () => {
    remote.getByUser.mockReturnValue(
      of({
        carts: [
          {
            id: 7,
            userId: 1,
            products: [
              {
                id: 1,
                title: 'Product',
                thumbnail: 'image.jpg',
                price: 10,
                discountPercentage: 10,
                quantity: 1,
              },
            ],
          },
        ],
      }),
    );
    const cart = await firstValueFrom(repo.getCart(1));
    await firstValueFrom(repo.saveCart(cart));
    expect(remote.save).toHaveBeenCalledWith({ userId: 1, products: [{ id: 1, quantity: 1 }] }, 7);
  });
  it('keeps local edits rather than fetching the unchanged server cart', async () => {
    await firstValueFrom(repo.saveCart(createCart(1, [line])));
    expect((await firstValueFrom(repo.getCart(1))).items).toEqual([line]);
    expect(remote.getByUser).not.toHaveBeenCalled();
  });
  it('does not DELETE simulated IDs and keeps an empty snapshot', async () => {
    const cart = await firstValueFrom(repo.saveCart(createCart(1, [line])));
    await firstValueFrom(repo.clearCart(cart));
    expect(remote.delete).not.toHaveBeenCalled();
    expect((await firstValueFrom(repo.getCart(1))).items).toEqual([]);
    expect(remote.getByUser).not.toHaveBeenCalled();
  });
  it('isolates local carts by user', async () => {
    await firstValueFrom(repo.saveCart(createCart(1, [line])));
    expect((await firstValueFrom(repo.getCart(2))).items).toEqual([]);
  });
  it('does not overwrite the cart when a save fails', async () => {
    const cart = await firstValueFrom(repo.saveCart(createCart(1, [line])));
    remote.save.mockReturnValue(throwError(() => new Error('offline')));
    await expect(
      firstValueFrom(repo.saveCart(createCart(1, [{ ...line, quantity: 2 }], cart.id))),
    ).rejects.toThrow('offline');
    expect((await firstValueFrom(repo.getCart(1))).items[0].quantity).toBe(1);
  });
});
