import { describe, it, expect } from 'vitest';
import { firstValueFrom, throwError } from 'rxjs';
import { GetProductsUseCase } from '@usecases/products/get-products.usecase';
import { AppError } from 'src/domain/errors/app-error';
import { productsRepository, page } from '../../fixtures';
describe('GetProductsUseCase', () => {
  it('normalizes search and delegates the complete query', async () => {
    const repo = productsRepository();
    const query = {
      limit: 20,
      skip: 0,
      search: ' phone ',
      category: 'smartphones',
      sortBy: 'price' as const,
      order: 'desc' as const,
    };
    expect(await firstValueFrom(new GetProductsUseCase(repo).execute(query))).toEqual(page);
    expect(repo.getProducts).toHaveBeenCalledWith({ ...query, search: 'phone' });
  });
  it.each([
    { limit: 0, skip: 0 },
    { limit: 101, skip: 0 },
    { limit: 20, skip: -1 },
    { limit: 20, skip: 0.5 },
  ])('rejects invalid pagination %j before requesting data', async (query) => {
    const repo = productsRepository();
    await expect(firstValueFrom(new GetProductsUseCase(repo).execute(query))).rejects.toMatchObject(
      { messageKey: 'errors.products.invalid_query' },
    );
    expect(repo.getProducts).not.toHaveBeenCalled();
  });
  it('preserves typed errors', async () => {
    const repo = productsRepository();
    const error = new AppError('errors.network');
    repo.getProducts.mockReturnValue(throwError(() => error));
    await expect(
      firstValueFrom(new GetProductsUseCase(repo).execute({ limit: 20, skip: 0 })),
    ).rejects.toBe(error);
  });
});
