import { Observable } from 'rxjs';
import { ProductDto, ProductsDto } from '../dto/product.dto';

export abstract class ProductsRemoteDataSource {
  abstract getProducts(limit: number, skip: number): Observable<ProductsDto>;
  abstract getProduct(id: number): Observable<ProductDto>;
}
