import { ProductsDto } from '../../dto/product.dto';

export interface CachedProducts {
  data: ProductsDto;
  cachedAt: number; // Date.now()
}

export const PRODUCTS_CACHE_TTL_MS = 60 * 60 * 1000; // 1h
