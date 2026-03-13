import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { AuthImpRepository } from '@data/repositories/auth/auth-implementation.repository';
import { AuthRemoteDataSource } from '@data/datasource/auth/source/auth-remote.datasource';
import { AuthRemoteDataSourceImp } from '@data/datasource/auth/remote/auth-remote.datasource.imp';
import { AuthLocalDataSource } from '@data/datasource/auth/source/auth-local.datasource';
import { AuthLocalDataSourceImp } from '@data/datasource/auth/local/auth-local.datasource.imp';
import {
  LoginDtoToEntityMapper,
  UserDtoToEntityMapper,
} from '@data/repositories/auth/mappers/auth-dto-to-entity.mapper';
import { TokensDboToEntityMapper } from '@data/repositories/auth/mappers/auth-dbo-to-entity.mapper';
import { LoginUseCase } from '@usecases/auth/login.usecase';
import { GetAuthUserUseCase } from '@usecases/auth/get-auth-user.usecase';
import { RefreshTokenUseCase } from '@usecases/auth/refresh-token.usecase';

export function provideAuthDI(): EnvironmentProviders {
  return makeEnvironmentProviders([
    LoginUseCase,
    GetAuthUserUseCase,
    RefreshTokenUseCase,
    LoginDtoToEntityMapper,
    UserDtoToEntityMapper,
    TokensDboToEntityMapper,
    { provide: AuthRepository, useClass: AuthImpRepository },
    { provide: AuthRemoteDataSource, useClass: AuthRemoteDataSourceImp },
    { provide: AuthLocalDataSource, useClass: AuthLocalDataSourceImp },
  ]);
}
