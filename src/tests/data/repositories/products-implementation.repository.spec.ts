import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ProductsRepository } from '@repositories/products/products.repository';
import { provideProductsDI } from '@di/products/products.di';
import { ProductsLocalDataSource } from 'src/data/datasource/products/source/products-local.source';
import { ProductsRemoteDataSource } from 'src/data/datasource/products/source/products-remote.source';
import { NotFoundError } from 'src/domain/errors/app-error';
import { page, product } from '../../fixtures';
describe('ProductsRepositoryImp', () => {
  const local = { getProducts: vi.fn(), saveProducts: vi.fn() };
  const remote = { getProducts: vi.fn(), getProduct: vi.fn(), getCategories: vi.fn() };
  let repo: ProductsRepository;
  beforeEach(() => {
    vi.resetAllMocks();
    local.getProducts.mockReturnValue(of(null));
    remote.getProducts.mockReturnValue(of(page));
    remote.getProduct.mockReturnValue(of(product));
    TestBed.configureTestingModule({
      providers: [
        provideProductsDI(),
        { provide: ProductsLocalDataSource, useValue: local },
        { provide: ProductsRemoteDataSource, useValue: remote },
      ],
    });
    repo = TestBed.inject(ProductsRepository);
  });
  it('uses valid cache without HTTP', async () => {
    local.getProducts.mockReturnValue(of({ ...page, cachedAt: Date.now() }));
    expect(await firstValueFrom(repo.getProducts({ limit: 20, skip: 0 }))).toEqual(page);
    expect(remote.getProducts).not.toHaveBeenCalled();
  });
  it('fetches, maps and saves cache misses', async () => {
    expect(await firstValueFrom(repo.getProducts({ limit: 20, skip: 0 }))).toEqual(page);
    expect(remote.getProducts).toHaveBeenCalledOnce();
    expect(local.saveProducts).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ ...page, cachedAt: expect.any(Number) }),
    );
  });
  it('uses different cache keys for every query dimension', async () => {
    for (const query of [
      { limit: 20, skip: 0 },
      { limit: 10, skip: 0 },
      { limit: 20, skip: 20 },
      { limit: 20, skip: 0, search: 'phone' },
      { limit: 20, skip: 0, category: 'beauty' },
      { limit: 20, skip: 0, order: 'desc' as const },
      { limit: 20, skip: 0, sortBy: 'price' as const },
    ])
      await firstValueFrom(repo.getProducts(query));
    expect(new Set(local.getProducts.mock.calls.map(([key]) => key)).size).toBe(7);
  });
  it('translates missing products into a domain error', async () => {
    remote.getProduct.mockReturnValue(throwError(() => new NotFoundError('errors.not_found')));
    await expect(firstValueFrom(repo.getProduct(999))).rejects.toMatchObject({
      messageKey: 'errors.products.not_found',
    });
  });
});
