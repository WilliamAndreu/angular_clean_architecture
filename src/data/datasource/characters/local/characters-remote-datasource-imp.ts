import { Injectable } from '@angular/core';
import { environment } from 'src/core/environments/environment';
import { CharacterDBO } from './dbo/rick-and-morty-characters.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DboToEntityRepositoryMapper } from '@data/repositories/character/mappers/dbo-to-entity.mapper';
import { Request } from 'src/core/core-interface/request';
import { CharactersEntity } from '@models/characters/characters-entity.model';
import { CharactersLocalDataSource } from '../source/characters-local-datasource';

@Injectable()
export class CharactersLocalDataSourceImp extends CharactersLocalDataSource {
  userMapper = new DboToEntityRepositoryMapper();
  private path = `${environment.apiBaseUrl}`;
  private charactersSubject = new BehaviorSubject<CharactersEntity>(
    {} as CharactersEntity
  );

  constructor(private db: Request) {
    super();
  }

  override getCharactersList({
    page,
    needRequest,
  }: {
    page: number;
    needRequest: boolean;
  }): Observable<CharactersEntity> {
    const shouldMakeRequest = (needRequest && this.hasNextPage()) || page === 1;
    return this.requestCharacters(page);
  }

  private hasNextPage(): boolean {
    const infoValue = this.charactersSubject.value.info;
    return !!infoValue && infoValue.next !== undefined;
  }

  private requestCharacters(page: number): Observable<CharactersEntity> {
    return this.db.doRequest<CharacterDBO>('get',`${this.path}/character/?page=${page}`)
  }
}
