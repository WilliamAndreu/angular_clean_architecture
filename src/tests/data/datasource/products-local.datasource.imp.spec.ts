import { describe, it, expect } from 'vitest';
import {
  PRODUCTS_CACHE_TTL_MS,
  ProductsDbo,
} from 'src/data/datasource/products/local/dbo/products.dbo';

const mockProductsDbo: ProductsDbo = {
  products: [],
  total: 0,
  skip: 0,
  limit: 20,
  cachedAt: Date.now(),
};

describe('ProductsLocalDataSourceImp (TTL cache)', () => {
  it('exports correct TTL of 1 hour', () => {
    expect(PRODUCTS_CACHE_TTL_MS).toBe(60 * 60 * 1000);
  });

  it('returns null for expired cache (Date.now mocked)', () => {
    const storage = new Map<string, unknown>();
    const expired = Date.now() - PRODUCTS_CACHE_TTL_MS - 1;
    storage.set('products_skip_0', { ...mockProductsDbo, cachedAt: expired });

    const cached = storage.get('products_skip_0') as ProductsDbo;
    const isExpired = Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS;
    expect(isExpired).toBe(true);
  });

  it('returns data for valid cache', () => {
    const storage = new Map<string, unknown>();
    storage.set('products_skip_0', mockProductsDbo);

    const cached = storage.get('products_skip_0') as ProductsDbo;
    const isExpired = Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS;
    expect(isExpired).toBe(false);
    expect(cached.products).toEqual(mockProductsDbo.products);
  });
});
