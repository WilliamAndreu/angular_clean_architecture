import { Injectable } from '@angular/core';
import { Mapper } from '@interfaces/mapper';
import { LoginRequestDto } from '@data/datasource/auth/remote/dto/auth.dto';
import { LoginCredentialsEntity } from '@models/auth/auth-entity.model';

@Injectable()
export class LoginCredentialsDtoMapper extends Mapper<LoginRequestDto, LoginCredentialsEntity> {
  mapFrom(dto: LoginRequestDto): LoginCredentialsEntity {
    return {
      username: dto.username,
      password: dto.password,
    };
  }

  mapTo(entity: LoginCredentialsEntity): LoginRequestDto {
    return {
      username: entity.username,
      password: entity.password,
      expiresInMins: 60,
    };
  }
}
