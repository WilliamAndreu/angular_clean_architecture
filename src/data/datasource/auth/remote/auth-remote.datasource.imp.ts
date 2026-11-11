import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/core/config/environments/environment';
import { Request } from 'src/core/http/request';
import { AuthRemoteDataSource } from 'src/data/datasource/auth/source/auth-remote.source';
import { LoginDto, LoginRequestDto, TokensDto, UserDto } from './dto/auth.dto';

@Injectable()
export class AuthRemoteDataSourceImp extends AuthRemoteDataSource {
  private readonly request = inject(Request);

  override login(dto: LoginRequestDto): Observable<LoginDto> {
    return this.request.doRequest<LoginDto>('POST', `${environment.apiBaseUrl}/auth/login`, dto);
  }

  override getAuthUser(): Observable<UserDto> {
    return this.request.doRequest<UserDto>('GET', `${environment.apiBaseUrl}/auth/me`);
  }

  override refreshToken(refreshToken: string): Observable<TokensDto> {
    return this.request.doRequest<TokensDto>('POST', `${environment.apiBaseUrl}/auth/refresh`, {
      refreshToken,
      expiresInMins: 60,
    });
  }
}
