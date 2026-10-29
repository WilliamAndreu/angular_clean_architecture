import { Observable } from 'rxjs';
import { ProductDto } from 'src/data/datasource/products/remote/dto/product.dto';
import { ProductsDto } from 'src/data/datasource/products/remote/dto/products.dto';

export interface ProductRequestDto {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
}
export interface CategoryDto {
  slug: string;
  name: string;
  url: string;
}
export abstract class ProductsRemoteDataSource {
  abstract getProducts(query: ProductRequestDto): Observable<ProductsDto>;
  abstract getCategories(): Observable<CategoryDto[]>;
  abstract getProduct(id: number): Observable<ProductDto>;
}
