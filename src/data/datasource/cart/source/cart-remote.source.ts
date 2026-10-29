import { Observable } from 'rxjs';
import { CartDto, CartPageDto, CartRequestDto } from '../remote/dto/cart.dto';
export abstract class CartRemoteDataSource {
  abstract getByUser(userId: number): Observable<CartPageDto>;
  abstract save(dto: CartRequestDto, id?: number): Observable<CartDto>;
  abstract delete(id: number): Observable<unknown>;
}
