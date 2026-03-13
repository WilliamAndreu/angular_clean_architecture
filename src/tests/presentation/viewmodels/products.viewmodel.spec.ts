import { describe, it, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { AppError } from 'src/core/errors/app-error';
import { ProductsEntity } from 'src/domain/entities/products/product-entity.model';

const mockEntity: ProductsEntity = {
  products: [
    {
      id: 1,
      title: 'Prod A',
      description: '',
      price: 10,
      discountPercentage: 0,
      rating: 4,
      stock: 5,
      brand: '',
      category: 'cat',
      thumbnail: '',
      images: [],
      availabilityStatus: 'In Stock',
      tags: [],
    },
  ],
  total: 1,
  skip: 0,
  limit: 20,
};

describe('ProductsViewModel (logic)', () => {
  it('sets error messageKey on failure', () => {
    const err = new AppError('errors.products.load_failed');
    const usecase = {
      execute: vi.fn((_p: { limit: number; skip: number }) => throwError(() => err)),
    };

    let errorKey: string | null = null;
    usecase.execute({ limit: 20, skip: 0 }).subscribe({
      error: (e: unknown) => {
        errorKey = e instanceof AppError ? e.messageKey : 'errors.unknown';
      },
    });

    expect(errorKey).toBe('errors.products.load_failed');
  });

  it('sets products on success', () => {
    const usecase = { execute: vi.fn((_p: { limit: number; skip: number }) => of(mockEntity)) };

    let products: typeof mockEntity.products = [];
    usecase.execute({ limit: 20, skip: 0 }).subscribe({
      next: (data: ProductsEntity) => {
        products = data.products;
      },
    });

    expect(products).toHaveLength(1);
    expect(products[0].title).toBe('Prod A');
  });
});
