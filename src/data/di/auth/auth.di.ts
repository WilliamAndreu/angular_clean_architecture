import { LogoutUseCase } from '@usecases/auth/logout.usecase';
import { RestoreSessionUseCase } from '@usecases/auth/restore-session.usecase';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { AuthRepositoryImp } from 'src/data/repositories/auth/auth.repository.imp';
import { AuthRemoteDataSource } from 'src/data/datasource/auth/source/auth-remote.source';
import { AuthRemoteDataSourceImp } from '@data/datasource/auth/remote/auth-remote.datasource.imp';
import { AuthLocalDataSource } from 'src/data/datasource/auth/source/auth-local.source';
import { AuthLocalDataSourceImp } from '@data/datasource/auth/local/auth-local.datasource.imp';
import {
  LoginDtoToEntityMapperImp,
  UserDtoToEntityMapperImp,
} from 'src/data/repositories/auth/mappers/auth-dto-to-entity.mapper.imp';
import { TokensDboToEntityMapperImp } from 'src/data/repositories/auth/mappers/auth-dbo-to-entity.mapper.imp';
import { LoginCredentialsDtoMapperImp } from 'src/data/repositories/auth/mappers/login-credentials-dto.mapper.imp';
import { LoginUseCase } from '@usecases/auth/login.usecase';
import { GetAuthUserUseCase } from '@usecases/auth/get-auth-user.usecase';
import { RefreshTokenUseCase } from '@usecases/auth/refresh-token.usecase';

export function provideAuthDI(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LoginUseCase,
      useFactory: (repo: AuthRepository) => new LoginUseCase(repo),
      deps: [AuthRepository],
    },
    {
      provide: GetAuthUserUseCase,
      useFactory: (repo: AuthRepository) => new GetAuthUserUseCase(repo),
      deps: [AuthRepository],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (repo: AuthRepository) => new RefreshTokenUseCase(repo),
      deps: [AuthRepository],
    },
    {
      provide: LogoutUseCase,
      useFactory: (repo: AuthRepository) => new LogoutUseCase(repo),
      deps: [AuthRepository],
    },
    {
      provide: RestoreSessionUseCase,
      useFactory: (repo: AuthRepository) => new RestoreSessionUseCase(repo),
      deps: [AuthRepository],
    },
    LoginDtoToEntityMapperImp,
    UserDtoToEntityMapperImp,
    TokensDboToEntityMapperImp,
    LoginCredentialsDtoMapperImp,
    { provide: AuthRepository, useClass: AuthRepositoryImp },
    { provide: AuthRemoteDataSource, useClass: AuthRemoteDataSourceImp },
    { provide: AuthLocalDataSource, useClass: AuthLocalDataSourceImp },
  ]);
}
