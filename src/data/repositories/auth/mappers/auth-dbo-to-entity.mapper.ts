import { Injectable } from '@angular/core';
import { Mapper } from '@interfaces/mapper';
import { TokensDbo } from '@data/datasource/auth/local/dbo/auth.dbo';
import { TokensEntity } from '@models/auth/auth-entity.model';

@Injectable()
export class TokensDboToEntityMapper extends Mapper<TokensDbo, TokensEntity> {
  mapFrom(dbo: TokensDbo): TokensEntity {
    return {
      accessToken: dbo.accessToken,
      refreshToken: dbo.refreshToken,
    };
  }

  mapTo(entity: TokensEntity): TokensDbo {
    return {
      accessToken: entity.accessToken,
      refreshToken: entity.refreshToken,
    };
  }
}
