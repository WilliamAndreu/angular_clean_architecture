import { CartRemoteDataSource } from 'src/data/datasource/cart/source/cart-remote.source';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from 'src/core/http/request';
import { environment } from 'src/core/config/environments/environment';
import { CartDto, CartPageDto, CartRequestDto } from 'src/data/datasource/cart/remote/dto/cart.dto';
@Injectable()
export class CartRemoteDataSourceImp extends CartRemoteDataSource {
  private readonly request = inject(Request);
  override getByUser(userId: number): Observable<CartPageDto> {
    return this.request.doRequest('GET', `${environment.apiBaseUrl}/carts/user/${userId}`);
  }
  override save(dto: CartRequestDto, id?: number): Observable<CartDto> {
    return this.request.doRequest(
      id === undefined ? 'POST' : 'PUT',
      `${environment.apiBaseUrl}/carts/${id ?? 'add'}`,
      { ...dto, merge: false },
    );
  }
  override delete(id: number): Observable<unknown> {
    return this.request.doRequest('DELETE', `${environment.apiBaseUrl}/carts/${id}`);
  }
}
