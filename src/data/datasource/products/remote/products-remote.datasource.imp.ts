import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Request } from '@interface-core/request';
import { ProductsRemoteDataSource } from '../source/products-remote.datasource';
import { ProductDto } from './dto/product.dto';
import { ProductsDto } from './dto/products.dto';

@Injectable()
export class ProductsRemoteDataSourceImp extends ProductsRemoteDataSource {
  private readonly request = inject(Request);

  override getProducts(limit: number, skip: number): Observable<ProductsDto> {
    return this.request.doRequest<ProductsDto>(
      'GET',
      `${environment.apiBaseUrl}/products`,
      undefined,
      { limit, skip },
    );
  }

  override getProduct(id: number): Observable<ProductDto> {
    return this.request.doRequest<ProductDto>('GET', `${environment.apiBaseUrl}/products/${id}`);
  }
}
