import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AppError } from 'src/core/errors/app-error';
import { ProductsEntity } from 'src/domain/entities/products/product-entity.model';

const mockEntity: ProductsEntity = {
  products: [],
  total: 0,
  skip: 0,
  limit: 20,
};

describe('GetProductsUseCase', () => {
  it('returns products from repository', async () => {
    const repo = { getProducts: vi.fn((_limit: number, _skip: number) => of(mockEntity)) };
    const result = await firstValueFrom(repo.getProducts(20, 0));
    expect(result).toEqual(mockEntity);
    expect(repo.getProducts).toHaveBeenCalledWith(20, 0);
  });

  it('wraps repository error with AppError', () => {
    const originalErr = new Error('Network failure');
    const wrapped = new AppError('errors.products.load_failed', { detail: originalErr.message });
    expect(wrapped.messageKey).toBe('errors.products.load_failed');
    expect(wrapped.context?.['detail']).toBe('Network failure');
  });
});
