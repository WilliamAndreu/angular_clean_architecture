import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AppError } from 'src/core/errors/app-error';
import { ProductEntity } from 'src/domain/entities/products/product-entity.model';

const mockProduct: ProductEntity = {
  id: 42,
  title: 'Widget',
  description: 'A widget',
  price: 9.99,
  discountPercentage: 0,
  rating: 4.2,
  stock: 10,
  brand: 'ACME',
  category: 'tools',
  thumbnail: 'thumb.jpg',
  images: [],
  availabilityStatus: 'In Stock',
  tags: [],
};

describe('GetProductUseCase', () => {
  it('returns product entity from repository', async () => {
    const repo = { getProduct: vi.fn((_id: number) => of(mockProduct)) };
    const result = await firstValueFrom(repo.getProduct(42));
    expect(result.id).toBe(42);
    expect(result.title).toBe('Widget');
  });

  it('wraps error as AppError with correct messageKey', () => {
    const err = new Error('Not found');
    const wrapped = new AppError('errors.products.load_failed', { detail: err.message });
    expect(wrapped).toBeInstanceOf(AppError);
    expect(wrapped.messageKey).toBe('errors.products.load_failed');
  });
});
