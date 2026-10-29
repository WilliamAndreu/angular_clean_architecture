import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageSource } from 'src/core/services/storage/source/storage.source';
import { ProductsLocalDataSource } from 'src/data/datasource/products/source/products-local.source';
import { ProductsDbo, PRODUCTS_CACHE_TTL_MS } from './dbo/products.dbo';

@Injectable()
export class ProductsLocalDataSourceImp extends ProductsLocalDataSource {
  private readonly storage = inject(StorageSource);
  private readonly CACHE_KEY_PREFIX = 'products_v2_';

  override getProducts(key: string): Observable<ProductsDbo | null> {
    const cached = this.storage.get<ProductsDbo>(this.cacheKey(key));
    if (!cached) return of(null);
    if (
      !Number.isFinite(cached.cachedAt) ||
      cached.cachedAt > Date.now() ||
      Date.now() - cached.cachedAt >= PRODUCTS_CACHE_TTL_MS ||
      !Array.isArray(cached.products) ||
      !Number.isFinite(cached.total) ||
      !Number.isFinite(cached.limit) ||
      !Number.isFinite(cached.skip)
    )
      return of(null);
    return of(cached);
  }

  override saveProducts(key: string, data: ProductsDbo): void {
    this.storage.set(this.cacheKey(key), data);
  }

  private cacheKey(key: string): string {
    return `${this.CACHE_KEY_PREFIX}${key}`;
  }
}
