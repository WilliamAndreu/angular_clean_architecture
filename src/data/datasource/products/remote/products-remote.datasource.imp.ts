import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/core/config/environments/environment';
import { Request } from 'src/core/http/request';
import {
  ProductsRemoteDataSource,
  ProductRequestDto,
  CategoryDto,
} from 'src/data/datasource/products/source/products-remote.source';
import { ProductDto } from './dto/product.dto';
import { ProductsDto } from './dto/products.dto';

@Injectable()
export class ProductsRemoteDataSourceImp extends ProductsRemoteDataSource {
  private readonly request = inject(Request);

  override getProducts(query: ProductRequestDto): Observable<ProductsDto> {
    const { limit, skip, search, category, sortBy = 'title', order = 'asc' } = query;
    const endpoint = category
      ? `/products/category/${encodeURIComponent(category)}`
      : search
        ? '/products/search'
        : '/products';
    // DummyJSON has no combined category + search endpoint. Fetch that category,
    // then filter and paginate its complete result, never the loaded UI page.
    const combined = Boolean(category && search);
    const params: Record<string, string | number> = {
      limit: combined ? 0 : limit,
      skip: combined ? 0 : skip,
      sortBy,
      order,
    };
    if (search && !category) params['q'] = search;
    return this.request
      .doRequest<ProductsDto>('GET', `${environment.apiBaseUrl}${endpoint}`, undefined, params)
      .pipe(
        map((dto) => {
          if (!combined) return dto;
          const term = search!.toLowerCase();
          const matches = dto.products.filter((p) =>
            `${p.title} ${p.description} ${p.brand ?? ''}`.toLowerCase().includes(term),
          );
          return {
            products: matches.slice(skip, skip + limit),
            total: matches.length,
            skip,
            limit,
          };
        }),
      );
  }
  override getCategories(): Observable<CategoryDto[]> {
    return this.request.doRequest<CategoryDto[]>(
      'GET',
      `${environment.apiBaseUrl}/products/categories`,
    );
  }
  override getProduct(id: number): Observable<ProductDto> {
    return this.request.doRequest<ProductDto>('GET', `${environment.apiBaseUrl}/products/${id}`);
  }
}
