import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Request } from '@interface-core/request';
import { AuthRemoteDataSource } from '../source/auth-remote.datasource';
import { LoginDto, TokensDto, UserDto } from './dto/auth.dto';

@Injectable()
export class AuthRemoteDataSourceImp extends AuthRemoteDataSource {
  private readonly request = inject(Request);

  override login(username: string, password: string): Observable<LoginDto> {
    return this.request.doRequest<LoginDto>('POST', `${environment.apiBaseUrl}/auth/login`, {
      username,
      password,
      expiresInMins: 60,
    });
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
