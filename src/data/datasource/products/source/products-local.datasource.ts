import { Observable } from 'rxjs';
import { ProductsDbo } from '../local/dbo/products.dbo';

export abstract class ProductsLocalDataSource {
  abstract getProducts(skip: number): Observable<ProductsDbo | null>;
  abstract saveProducts(skip: number, data: ProductsDbo): void;
}
