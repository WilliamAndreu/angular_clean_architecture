import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductsRemoteDataSource } from '@data/datasource/products/source/products-remote.datasource';
import { ProductsLocalDataSource } from '@data/datasource/products/source/products-local.datasource';
import { ProductDtoToEntityMapper } from './mappers/product-dto-to-entity.mapper';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';

@Injectable()
export class ProductsImpRepository extends ProductsRepository {
  private readonly remote = inject(ProductsRemoteDataSource);
  private readonly local = inject(ProductsLocalDataSource);
  private readonly mapper = inject(ProductDtoToEntityMapper);

  override getProducts(limit: number, skip: number): Observable<ProductsEntity> {
    return this.local.getProducts(skip).pipe(
      switchMap((cached) => {
        if (cached) {
          console.log(`[CACHE] products_skip_${skip}`);
          return of(this.mapper.mapListFrom(cached));
        }

        console.log(`[HTTP] GET /products?skip=${skip}&limit=${limit}`);
        return this.remote.getProducts(limit, skip).pipe(
          tap((dto) => {
            this.local.saveProducts(skip, dto);
            console.log(`[SAVED] products_skip_${skip}`);
          }),
          map((dto) => this.mapper.mapListFrom(dto)),
        );
      }),
    );
  }

  override getProduct(id: number): Observable<ProductEntity> {
    return this.remote.getProduct(id).pipe(
      map((dto) => this.mapper.mapFrom(dto)),
    );
  }
}
