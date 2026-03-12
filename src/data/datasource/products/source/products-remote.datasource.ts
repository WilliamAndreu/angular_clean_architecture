import { Observable } from 'rxjs';
import { ProductDto } from '../remote/dto/product.dto';
import { ProductsDto } from '../remote/dto/products.dto';

export abstract class ProductsRemoteDataSource {
  abstract getProducts(limit: number, skip: number): Observable<ProductsDto>;
  abstract getProduct(id: number): Observable<ProductDto>;
}
