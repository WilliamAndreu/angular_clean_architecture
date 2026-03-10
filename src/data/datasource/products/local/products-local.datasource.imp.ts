import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';
import { ProductsLocalDataSource } from '../source/products-local.datasource';
import { ProductsDto } from '../dto/product.dto';
import { CachedProducts, PRODUCTS_CACHE_TTL_MS } from './models/cached-products.model';

@Injectable()
export class ProductsLocalDataSourceImp extends ProductsLocalDataSource {
  private readonly storage = inject(StorageSource);
  private readonly CACHE_KEY_PREFIX = 'products_skip_';

  override getProducts(skip: number): Observable<ProductsDto | null> {
    const cached = this.storage.get<CachedProducts>(this.cacheKey(skip));
    if (!cached) return of(null);
    if (Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS) return of(null);
    return of(cached.data);
  }

  override saveProducts(skip: number, data: ProductsDto): void {
    const cached: CachedProducts = { data, cachedAt: Date.now() };
    this.storage.set(this.cacheKey(skip), cached);
  }

  private cacheKey(skip: number): string {
    return `${this.CACHE_KEY_PREFIX}${skip}`;
  }
}
