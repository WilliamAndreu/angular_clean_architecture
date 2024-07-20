import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CharactersRepository } from '@repositories/characters/characters.repository';
import { CharactersImpRepository } from './repositories/character/characters-implementation.repository';
import { GetHasNextAndCharactersUseCase } from '@usecases/characters/get-hasnext-and-characters.usecase';
import { CharactersRemoteDataSource } from './datasource/characters/source/characters-remote-datasource';
import { CharactersRemoteDataSourceImp } from './datasource/characters/remote/characters-remote-datasource-imp';
import { Request } from 'src/core/core-interface/request';
import { CharactersLocalDataSource } from './datasource/characters/source/characters-local-datasource';
import { CharactersLocalDataSourceImp } from './datasource/characters/local/characters-remote-datasource-imp';


@NgModule({
  providers: [
    Request,
    GetHasNextAndCharactersUseCase,
    { provide: CharactersRepository, useClass: CharactersImpRepository },
    { provide: CharactersRemoteDataSource, useClass: CharactersRemoteDataSourceImp },
    { provide: CharactersLocalDataSource, useClass: CharactersLocalDataSourceImp },
  ],
  imports: [CommonModule, HttpClientModule],
})
export class DataModule {}
