// filter-by-name.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { CharacterResult } from '@models/characters/characters-entity.model';

@Pipe({
  name: 'filterCharactersByName',
})
export class FilterCharactersByNamePipe implements PipeTransform {
  transform(
    characters: CharacterResult[] | undefined,
    searchTerm: string
  ): CharacterResult[] | undefined {
    if (!characters || !searchTerm.trim()) {
      return characters;
    }

    return characters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
