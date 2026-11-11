import { Injectable } from '@angular/core';
import { Mapper } from 'src/domain/interfaces/mapper';
import { LoginDto, UserDto } from '@data/datasource/auth/remote/dto/auth.dto';
import { LoginEntity, UserEntity } from '@models/auth/auth-entity.model';

@Injectable()
export class LoginDtoToEntityMapperImp extends Mapper<LoginDto, LoginEntity> {
  mapFrom(dto: LoginDto): LoginEntity {
    return {
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      user: {
        id: dto.id,
        username: dto.username,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        image: dto.image,
      },
    };
  }

  mapTo(entity: LoginEntity): LoginDto {
    return { ...entity.user, accessToken: entity.accessToken, refreshToken: entity.refreshToken };
  }
}

@Injectable()
export class UserDtoToEntityMapperImp extends Mapper<UserDto, UserEntity> {
  mapFrom(dto: UserDto): UserEntity {
    return {
      id: dto.id,
      username: dto.username,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      image: dto.image,
    };
  }

  mapTo(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender,
      image: entity.image,
    };
  }
}
