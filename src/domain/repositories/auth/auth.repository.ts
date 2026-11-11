import { Observable } from 'rxjs';
import {
  LoginCredentialsEntity,
  LoginEntity,
  TokensEntity,
  UserEntity,
} from '@models/auth/auth-entity.model';

export abstract class AuthRepository {
  abstract getAccessToken(): string | null;
  abstract restoreSession(): Observable<boolean>;
  abstract logout(): Observable<void>;
  abstract login(credentials: LoginCredentialsEntity): Observable<LoginEntity>;
  abstract getAuthUser(): Observable<UserEntity>;
  abstract refreshToken(): Observable<TokensEntity>;
}
