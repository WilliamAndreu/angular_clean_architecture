import { Observable } from 'rxjs';
import { LoginDto, LoginRequestDto, TokensDto, UserDto } from '../remote/dto/auth.dto';

export abstract class AuthRemoteDataSource {
  abstract login(dto: LoginRequestDto): Observable<LoginDto>;
  abstract getAuthUser(): Observable<UserDto>;
  abstract refreshToken(refreshToken: string): Observable<TokensDto>;
}
