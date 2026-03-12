import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';
import { ProductsLocalDataSource } from '../source/products-local.datasource';
import { ProductsDbo } from './dbo/products.dbo';

const PRODUCTS_CACHE_TTL_MS = 60 * 60 * 1000; // 1h

@Injectable()
export class ProductsLocalDataSourceImp extends ProductsLocalDataSource {
  private readonly storage = inject(StorageSource);
  private readonly CACHE_KEY_PREFIX = 'products_skip_';

  override getProducts(skip: number): Observable<ProductsDbo | null> {
    const cached = this.storage.get<ProductsDbo>(this.cacheKey(skip));
    if (!cached) return of(null);
    if (Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS) return of(null);
    return of(cached);
  }

  override saveProducts(skip: number, data: ProductsDbo): void {
    this.storage.set(this.cacheKey(skip), data);
  }

  private cacheKey(skip: number): string {
    return `${this.CACHE_KEY_PREFIX}${skip}`;
  }
}
