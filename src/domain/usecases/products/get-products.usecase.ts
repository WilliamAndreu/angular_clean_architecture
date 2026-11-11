import { Observable, throwError } from 'rxjs';
import { handleOperation } from 'src/domain/errors/handle-operation';
import { BadRequestError } from 'src/domain/errors/app-error';
import { ProductQuery } from '@models/products/product-query.model';
import { UseCase } from 'src/domain/interfaces/use-case';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductsEntity } from '@models/products/product-entity.model';

export class GetProductsUseCase implements UseCase<ProductQuery, ProductsEntity> {
  constructor(private readonly repo: ProductsRepository) {}
  execute(query: ProductQuery): Observable<ProductsEntity> {
    if (
      !Number.isInteger(query.limit) ||
      query.limit < 1 ||
      query.limit > 100 ||
      !Number.isInteger(query.skip) ||
      query.skip < 0
    )
      return throwError(
        () =>
          new BadRequestError('errors.products.invalid_query', undefined, {
            code: 'PRODUCT_INVALID_QUERY',
          }),
      );
    return handleOperation(
      () => this.repo.getProducts({ ...query, search: query.search?.trim() }),
      'errors.products.load_failed',
    );
  }
}
