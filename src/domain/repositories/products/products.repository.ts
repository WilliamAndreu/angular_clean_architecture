import { Observable } from 'rxjs';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';

export abstract class ProductsRepository {
  abstract getProducts(limit: number, skip: number): Observable<ProductsEntity>;
  abstract getProduct(id: number): Observable<ProductEntity>;
}
