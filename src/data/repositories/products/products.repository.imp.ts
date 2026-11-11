import { toAppError } from 'src/domain/errors/app-error';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError, catchError, map, switchMap, tap } from 'rxjs';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductQuery, ProductCategory } from '@models/products/product-query.model';
import { ProductsRemoteDataSource } from 'src/data/datasource/products/source/products-remote.source';
import { ProductsLocalDataSource } from 'src/data/datasource/products/source/products-local.source';
import { ProductDtoToEntityMapperImp } from 'src/data/repositories/products/mappers/product-dto-to-entity.mapper.imp';
import { ProductDboToEntityMapperImp } from 'src/data/repositories/products/mappers/product-dbo-to-entity.mapper.imp';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';
import { AppError, NotFoundError } from 'src/domain/errors/app-error';
import { ProductNotFoundError } from 'src/domain/errors/products/products.errors';

@Injectable()
export class ProductsRepositoryImp extends ProductsRepository {
  private readonly remote = inject(ProductsRemoteDataSource);
  private readonly local = inject(ProductsLocalDataSource);
  private readonly dtoMapper = inject(ProductDtoToEntityMapperImp);
  private readonly dboMapper = inject(ProductDboToEntityMapperImp);

  override getProducts(query: ProductQuery): Observable<ProductsEntity> {
    const normalized = {
      limit: query.limit,
      skip: query.skip,
      search: query.search?.trim() ?? '',
      category: query.category ?? '',
      sortBy: query.sortBy ?? 'title',
      order: query.order ?? 'asc',
    };
    const key = JSON.stringify(normalized);
    return this.local.getProducts(key).pipe(
      switchMap((cached) =>
        cached
          ? of(this.dboMapper.mapListFrom(cached))
          : this.remote.getProducts(normalized).pipe(
              map((dto) => this.dtoMapper.mapListFrom(dto)),
              tap((page) =>
                this.local.saveProducts(key, {
                  ...page,
                  products: page.products.map((p) => this.dboMapper.mapTo(p)),
                  cachedAt: Date.now(),
                }),
              ),
            ),
      ),
      catchError((err: unknown) =>
        throwError(() => (err instanceof AppError ? err : toAppError(err, 'errors.server'))),
      ),
    );
  }
  override getCategories(): Observable<ProductCategory[]> {
    return this.remote
      .getCategories()
      .pipe(map((items) => items.map(({ slug, name }) => ({ slug, name }))));
  }
  override getProduct(id: number): Observable<ProductEntity> {
    return this.remote.getProduct(id).pipe(
      map((dto) => this.dtoMapper.mapFrom(dto)),
      catchError((err: unknown) =>
        throwError(() =>
          err instanceof NotFoundError
            ? new ProductNotFoundError('errors.products.not_found', undefined, { cause: err })
            : err instanceof AppError
              ? err
              : toAppError(err, 'errors.server'),
        ),
      ),
    );
  }
}
