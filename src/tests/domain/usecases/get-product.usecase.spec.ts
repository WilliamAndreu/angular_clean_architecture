import { describe, it, expect } from 'vitest';
import { firstValueFrom, throwError } from 'rxjs';
import { GetProductUseCase } from '@usecases/products/get-product.usecase';
import { ProductNotFoundError } from 'src/domain/errors/products/products.errors';
import { productsRepository, product } from '../../fixtures';
describe('GetProductUseCase', () => {
  it('delegates the product ID', async () => {
    const repo = productsRepository();
    expect(await firstValueFrom(new GetProductUseCase(repo).execute(1))).toEqual(product);
    expect(repo.getProduct).toHaveBeenCalledWith(1);
  });
  it('preserves product-not-found errors', async () => {
    const repo = productsRepository();
    const error = new ProductNotFoundError('errors.products.not_found');
    repo.getProduct.mockReturnValue(throwError(() => error));
    await expect(firstValueFrom(new GetProductUseCase(repo).execute(1))).rejects.toBe(error);
  });
});
