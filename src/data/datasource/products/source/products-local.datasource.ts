import { Observable } from 'rxjs';
import { ProductsDto } from '../dto/product.dto';

export abstract class ProductsLocalDataSource {
  abstract getProducts(skip: number): Observable<ProductsDto | null>;
  abstract saveProducts(skip: number, data: ProductsDto): void;
}
