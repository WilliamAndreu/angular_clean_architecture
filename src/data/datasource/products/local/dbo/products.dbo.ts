import { ProductDbo } from './product.dbo';

export const PRODUCTS_CACHE_TTL_MS = 60 * 60 * 1000; // 1h

export interface ProductsDbo {
  products: ProductDbo[];
  total: number;
  skip: number;
  limit: number;
  cachedAt: number; // Date.now()
}
