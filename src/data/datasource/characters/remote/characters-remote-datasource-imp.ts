import { Injectable } from '@angular/core';
import { environment } from 'src/core/environments/environment';
import { CharacterDTO } from './dto/rick-and-morty-characters.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DtoToEntityRepositoryMapper } from '../../../repositories/character/mappers/dto-to-entity.mapper';
import { Request } from 'src/core/core-interface/request';
import { CharactersRemoteDataSource } from '../source/characters-remote-datasource';
import { CharactersEntity } from '@models/characters/characters-entity.model';

@Injectable()
export class CharactersRemoteDataSourceImp extends CharactersRemoteDataSource {
  userMapper = new DtoToEntityRepositoryMapper();
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
    return this.db.doRequest<CharacterDTO>('get',`${this.path}/character/?page=${page}`)
  }
}
