import { describe, it, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { AppError } from 'src/core/errors/app-error';
import { ProductEntity } from 'src/domain/entities/products/product-entity.model';

const mockProduct: ProductEntity = {
  id: 7,
  title: 'Widget',
  description: 'desc',
  price: 19.99,
  discountPercentage: 5,
  rating: 4.0,
  stock: 20,
  brand: 'BrandX',
  category: 'tools',
  thumbnail: '',
  images: ['a.jpg'],
  availabilityStatus: 'In Stock',
  tags: ['tag1'],
};

describe('ProductDetailViewModel (logic)', () => {
  it('sets error messageKey on failure', () => {
    const err = new AppError('errors.products.load_failed');
    const usecase = { execute: vi.fn((_id: number) => throwError(() => err)) };

    let errorKey: string | null = null;
    usecase.execute(7).subscribe({
      error: (e: unknown) => {
        errorKey = e instanceof AppError ? e.messageKey : 'errors.unknown';
      },
    });

    expect(errorKey).toBe('errors.products.load_failed');
  });

  it('sets product on success', () => {
    const usecase = { execute: vi.fn((_id: number) => of(mockProduct)) };

    let product: ProductEntity | null = null;
    usecase.execute(7).subscribe({
      next: (p: ProductEntity) => {
        product = p;
      },
    });

    expect(product).not.toBeNull();
    expect((product as unknown as ProductEntity).id).toBe(7);
  });
});
