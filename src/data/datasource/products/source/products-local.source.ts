import { Observable } from 'rxjs';
import { ProductsDbo } from 'src/data/datasource/products/local/dbo/products.dbo';
export abstract class ProductsLocalDataSource {
  abstract getProducts(key: string): Observable<ProductsDbo | null>;
  abstract saveProducts(key: string, data: ProductsDbo): void;
}
