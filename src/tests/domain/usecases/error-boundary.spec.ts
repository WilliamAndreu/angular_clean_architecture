import { describe, it, expect } from 'vitest';
import { firstValueFrom, throwError } from 'rxjs';
import { GetProductsUseCase } from '@usecases/products/get-products.usecase';
import { handleOperation } from 'src/domain/errors/handle-operation';
import { InsufficientStockError } from 'src/domain/errors/cart/cart.errors';
import { productsRepository } from '../../fixtures';
describe('Portable operation boundary', () => {
  it('turns synchronous repository throws into typed Observable errors', async () => {
    const original = new TypeError('adapter bug');
    const repo = productsRepository();
    repo.getProducts.mockImplementation(() => {
      throw original;
    });
    const stream = new GetProductsUseCase(repo).execute({ limit: 20, skip: 0 });
    expect(repo.getProducts).not.toHaveBeenCalled();
    await expect(firstValueFrom(stream)).rejects.toMatchObject({
      code: 'UNEXPECTED',
      cause: original,
      messageKey: 'errors.products.load_failed',
    });
  });
  it('retains the same domain error through an async boundary', async () => {
    const failure = new InsufficientStockError();
    await expect(firstValueFrom(handleOperation(() => throwError(() => failure)))).rejects.toBe(
      failure,
    );
  });
});
