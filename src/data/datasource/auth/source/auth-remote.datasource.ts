import { Observable } from 'rxjs';
import { LoginDto, TokensDto, UserDto } from '../remote/dto/auth.dto';

export abstract class AuthRemoteDataSource {
  abstract login(username: string, password: string): Observable<LoginDto>;
  abstract getAuthUser(): Observable<UserDto>;
  abstract refreshToken(refreshToken: string): Observable<TokensDto>;
}
