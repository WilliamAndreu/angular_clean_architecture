import { ProductDto } from './product.dto';

export interface ProductsDto {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
}
