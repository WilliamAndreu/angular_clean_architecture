import { Observable } from 'rxjs';
import { UseCase } from '@interface-core/use-case';
import { CharactersRepository } from '../../repositories/characters/characters.repository';
import { CharactersEntity } from '../../entities/characters/characters-entity.model';
import { Injectable } from '@angular/core';

@Injectable()
export class GetHasNextAndCharactersUseCase
  implements UseCase<{ page: number; needRequest: boolean }, CharactersEntity>
{
  constructor(private charactersRepository: CharactersRepository) {}

  execute(params: {
    page: number;
    needRequest: boolean;
  }): Observable<CharactersEntity> {
    return this.charactersRepository.getCharacters(params);
  }
}
