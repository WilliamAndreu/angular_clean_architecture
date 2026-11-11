import { handleOperation } from 'src/domain/errors/handle-operation';
import { Observable } from 'rxjs';
import { ProductCategory } from '@models/products/product-query.model';
import { ProductsRepository } from '@repositories/products/products.repository';
import { UseCase } from 'src/domain/interfaces/use-case';

export class GetCategoriesUseCase implements UseCase<void, ProductCategory[]> {
  constructor(private readonly repo: ProductsRepository) {}
  execute(): Observable<ProductCategory[]> {
    return handleOperation(() => this.repo.getCategories());
  }
}
