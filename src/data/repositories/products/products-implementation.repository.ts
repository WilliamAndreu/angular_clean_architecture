import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductsRemoteDataSource } from '@data/datasource/products/source/products-remote.datasource';
import { ProductsLocalDataSource } from '@data/datasource/products/source/products-local.datasource';
import { ProductDtoToEntityMapper } from './mappers/product-dto-to-entity.mapper';
import { ProductDboToEntityMapper } from './mappers/product-dbo-to-entity.mapper';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';
import { ProductsDbo } from '@data/datasource/products/local/dbo/products.dbo';
import { ProductDbo } from '@data/datasource/products/local/dbo/product.dbo';

@Injectable()
export class ProductsImpRepository extends ProductsRepository {
  private readonly remote = inject(ProductsRemoteDataSource);
  private readonly local = inject(ProductsLocalDataSource);
  private readonly dtoMapper = inject(ProductDtoToEntityMapper);
  private readonly dboMapper = inject(ProductDboToEntityMapper);

  override getProducts(limit: number, skip: number): Observable<ProductsEntity> {
    return this.local.getProducts(skip).pipe(
      switchMap((cached) => {
        if (cached) {
          console.log(`[CACHE] products_skip_${skip}`);
          return of(this.dboMapper.mapListFrom(cached));
        }

        console.log(`[HTTP] GET /products?skip=${skip}&limit=${limit}`);
        return this.remote.getProducts(limit, skip).pipe(
          tap((dto) => {
            const dbo: ProductsDbo = {
              products: dto.products.map(
                (p): ProductDbo => ({
                  id: p.id,
                  title: p.title,
                  description: p.description,
                  price: p.price,
                  discountPercentage: p.discountPercentage,
                  rating: p.rating,
                  stock: p.stock,
                  brand: p.brand ?? '',
                  category: p.category,
                  thumbnail: p.thumbnail,
                  images: p.images,
                  availabilityStatus: p.availabilityStatus,
                  tags: p.tags ?? [],
                }),
              ),
              total: dto.total,
              skip: dto.skip,
              limit: dto.limit,
              cachedAt: Date.now(),
            };
            this.local.saveProducts(skip, dbo);
            console.log(`[SAVED] products_skip_${skip}`);
          }),
          map((dto) => this.dtoMapper.mapListFrom(dto)),
        );
      }),
    );
  }

  override getProduct(id: number): Observable<ProductEntity> {
    return this.remote.getProduct(id).pipe(map((dto) => this.dtoMapper.mapFrom(dto)));
  }
}
