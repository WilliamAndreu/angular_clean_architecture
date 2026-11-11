import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { ProductsRemoteDataSourceImp } from '@data/datasource/products/remote/products-remote.datasource.imp';
import { environment } from 'src/core/config/environments/environment';
import { page, product } from '../../fixtures';
describe('ProductsRemoteDataSourceImp', () => {
  let source: ProductsRemoteDataSourceImp;
  let controller: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProductsRemoteDataSourceImp],
    });
    source = TestBed.inject(ProductsRemoteDataSourceImp);
    controller = TestBed.inject(HttpTestingController);
  });
  afterEach(() => controller.verify());
  it('uses server search, sorting and pagination', async () => {
    const result = firstValueFrom(
      source.getProducts({ limit: 10, skip: 20, search: 'phone', sortBy: 'price', order: 'desc' }),
    );
    const req = controller.expectOne((r) => r.url === `${environment.apiBaseUrl}/products/search`);
    expect(req.request.params.get('q')).toBe('phone');
    expect(req.request.params.get('skip')).toBe('20');
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('sortBy')).toBe('price');
    req.flush(page);
    expect(await result).toEqual(page);
  });
  it('combines category and search across the full category before paginating', async () => {
    const result = firstValueFrom(
      source.getProducts({ limit: 1, skip: 1, category: 'beauty', search: 'match' }),
    );
    const req = controller.expectOne((r) => r.url.endsWith('/products/category/beauty'));
    expect(req.request.params.get('limit')).toBe('0');
    expect(req.request.params.get('skip')).toBe('0');
    req.flush({
      ...page,
      products: [
        { ...product, id: 1, title: 'Match first' },
        { ...product, id: 2, title: 'Other' },
        { ...product, id: 3, title: 'Match second' },
      ],
    });
    expect(await result).toMatchObject({ total: 2, products: [{ id: 3 }], skip: 1, limit: 1 });
  });
});
