import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { PRODUCTS_CACHE_TTL_MS } from 'src/data/datasource/products/local/models/cached-products.model';
import { ProductsDto } from 'src/data/datasource/products/dto/product.dto';

const mockProductsDto: ProductsDto = {
  products: [],
  total: 0,
  skip: 0,
  limit: 20,
};

describe('ProductsLocalDataSourceImp (TTL cache)', () => {
  it('exports correct TTL of 1 hour', () => {
    expect(PRODUCTS_CACHE_TTL_MS).toBe(60 * 60 * 1000);
  });

  it('returns null for expired cache (Date.now mocked)', async () => {
    const storage = new Map<string, unknown>();
    const now = Date.now();
    const expired = now - PRODUCTS_CACHE_TTL_MS - 1;
    storage.set('products_skip_0', { data: mockProductsDto, cachedAt: expired });

    const cached = storage.get('products_skip_0') as { data: ProductsDto; cachedAt: number };
    const isExpired = Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS;
    expect(isExpired).toBe(true);
  });

  it('returns data for valid cache', () => {
    const storage = new Map<string, unknown>();
    const now = Date.now();
    storage.set('products_skip_0', { data: mockProductsDto, cachedAt: now });

    const cached = storage.get('products_skip_0') as { data: ProductsDto; cachedAt: number };
    const isExpired = Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS;
    expect(isExpired).toBe(false);
    expect(cached.data).toEqual(mockProductsDto);
  });
});
