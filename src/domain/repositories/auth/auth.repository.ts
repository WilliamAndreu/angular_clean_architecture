import { Observable } from 'rxjs';
import { LoginEntity, TokensEntity, UserEntity } from '@models/auth/auth-entity.model';

export abstract class AuthRepository {
  abstract login(username: string, password: string): Observable<LoginEntity>;
  abstract getAuthUser(): Observable<UserEntity>;
  abstract refreshToken(): Observable<TokensEntity>;
}
