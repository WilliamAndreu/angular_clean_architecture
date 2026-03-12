import { Injectable } from '@angular/core';
import { Mapper } from '@interface-core/mapper';
import { LoginDto, UserDto } from '@data/datasource/auth/remote/dto/auth.dto';
import { LoginEntity, UserEntity } from '@models/auth/auth-entity.model';

@Injectable()
export class LoginDtoToEntityMapper extends Mapper<LoginDto, LoginEntity> {
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
    return { ...entity.user, ...entity } as LoginDto;
  }
}

@Injectable()
export class UserDtoToEntityMapper extends Mapper<UserDto, UserEntity> {
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
    return entity as UserDto;
  }
}
