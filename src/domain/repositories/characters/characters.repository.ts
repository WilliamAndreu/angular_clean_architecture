import { Observable } from 'rxjs';
import { CharactersEntity } from '../../entities/characters/characters-entity.model';

export abstract class CharactersRepository {
  abstract getCharacters(params: { page: number; needRequest: boolean }): Observable<CharactersEntity>;
}
