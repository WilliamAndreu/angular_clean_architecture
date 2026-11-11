import { Observable, throwError } from 'rxjs';
import { handleOperation } from 'src/domain/errors/handle-operation';
import { ProductNotFoundError } from 'src/domain/errors/products/products.errors';
import { UseCase } from 'src/domain/interfaces/use-case';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductEntity } from '@models/products/product-entity.model';

export class GetProductUseCase implements UseCase<number, ProductEntity> {
  constructor(private readonly repo: ProductsRepository) {}
  execute(id: number): Observable<ProductEntity> {
    if (!Number.isInteger(id) || id < 1) return throwError(() => new ProductNotFoundError());
    return handleOperation(() => this.repo.getProduct(id), 'errors.products.load_failed');
  }
}
