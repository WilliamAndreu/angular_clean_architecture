import { BehaviorSubject, Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { CharactersRepository } from '@repositories/characters/characters.repository';
import { CharactersEntity } from '@models/characters/characters-entity.model';
import { CharactersRemoteDataSource } from '@data/datasource/characters/source/characters-remote-datasource';
import { DtoToEntityRepositoryMapper } from './mappers/dto-to-entity.mapper';

@Injectable()
export class CharactersImpRepository extends CharactersRepository {

  userMapper = new DtoToEntityRepositoryMapper();
  private charactersSubject = new BehaviorSubject<CharactersEntity>({} as CharactersEntity);
  
  constructor(private charactersRemoteDataSource: CharactersRemoteDataSource) {
    super();
  }

  override getCharacters(params: { page: number; needRequest: boolean; }): Observable<CharactersEntity> {
    return this.charactersRemoteDataSource.getCharactersList(params)
    .pipe(
      map(this.userMapper.mapTo),
      map(value => {
        const dataStored = this.charactersSubject.value;
        // Update the stored information with the new server response
        if (value.info) {
          dataStored.info = value.info;
        }
        // Update the stored results with the new server response
        params.page === 1 && value.results ? dataStored.results = value.results : dataStored.results.push(...value.results);
        return dataStored;
        // Notify subscribers about the change in characters
        //this.charactersSubject.next(dataStored);
      })
    );
  }
}
