import { ProductQuery, ProductCategory } from '@models/products/product-query.model';
import { Observable } from 'rxjs';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';

export abstract class ProductsRepository {
  abstract getProducts(query: ProductQuery): Observable<ProductsEntity>;
  abstract getCategories(): Observable<ProductCategory[]>;
  abstract getProduct(id: number): Observable<ProductEntity>;
}
