import { ProductDbo } from './product.dbo';

export interface ProductsDbo {
  products: ProductDbo[];
  total: number;
  skip: number;
  limit: number;
  cachedAt: number; // Date.now()
}
