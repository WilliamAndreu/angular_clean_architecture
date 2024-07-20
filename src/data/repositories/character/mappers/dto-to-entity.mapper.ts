import { Mapper } from 'src/core/core-interface/mapper';
import { CharacterDTO } from '../../../datasource/characters/remote/dto/rick-and-morty-characters.model';
import { CharactersEntity } from '@models/characters/characters-entity.model';

/**
 * Mapper class for converting CharacterModel to CharactersEntity and vice versa.
 */
export class DtoToEntityRepositoryMapper extends Mapper<
CharacterDTO,
  CharactersEntity
> {
  /**
   * Maps from a CharacterModel to a CharactersEntity.
   *
   * @param param - The input CharacterModel to be mapped.
   * @returns A new CharactersEntity instance.
   */
  mapTo(param: CharacterDTO): CharactersEntity {
    return {
      info: param.info,
      results: param.results,
    };
  }

  /**
   * Maps from a CharactersModel to a CharacterModel.
   *
   * @param param - The input CharactersModel to be mapped.
   * @returns A new CharacterModel instance.
   */
  mapFrom(param: CharactersEntity): CharacterDTO {
    return {
      info: param.info,
      results: param.results,
    };
  }
}
