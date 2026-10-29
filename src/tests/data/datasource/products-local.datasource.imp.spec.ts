import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { ProductsLocalDataSourceImp } from '@data/datasource/products/local/products-local.datasource.imp';
import { PRODUCTS_CACHE_TTL_MS } from '@data/datasource/products/local/dbo/products.dbo';
import { StorageSource } from 'src/core/services/storage/source/storage.source';
import { LocalStorageServiceImp } from 'src/core/services/storage/local-storage/local-storage.service.imp';
import { page } from '../../fixtures';
describe('ProductsLocalDataSourceImp', () => {
  let source: ProductsLocalDataSourceImp;
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(10000000);
    TestBed.configureTestingModule({
      providers: [
        ProductsLocalDataSourceImp,
        { provide: StorageSource, useClass: LocalStorageServiceImp },
      ],
    });
    source = TestBed.inject(ProductsLocalDataSourceImp);
  });
  afterEach(() => vi.useRealTimers());
  it('reads a valid page through the real storage adapter', async () => {
    source.saveProducts('query', { ...page, cachedAt: Date.now() });
    expect(await firstValueFrom(source.getProducts('query'))).toMatchObject(page);
  });
  it('expires exactly at the TTL boundary', async () => {
    source.saveProducts('query', { ...page, cachedAt: Date.now() });
    vi.advanceTimersByTime(PRODUCTS_CACHE_TTL_MS);
    expect(await firstValueFrom(source.getProducts('query'))).toBeNull();
  });
  it('rejects malformed or legacy cache entries', async () => {
    localStorage.setItem('products_v2_query', JSON.stringify(page));
    expect(await firstValueFrom(source.getProducts('query'))).toBeNull();
  });
  it('isolates query keys', async () => {
    source.saveProducts('20:0', { ...page, cachedAt: Date.now() });
    expect(await firstValueFrom(source.getProducts('10:0'))).toBeNull();
  });
});
