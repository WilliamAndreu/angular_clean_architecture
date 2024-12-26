import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CharactersRepository } from '@repositories/characters/characters.repository';
import { Request } from 'src/core/core-interface/request';
import { GetHasNextAndCharactersUseCase } from '@usecases/characters/get-hasnext-and-characters.usecase';
import { CharactersImpRepository } from '@data/repositories/character/characters-implementation.repository';
import { CharactersRemoteDataSourceImp } from '@data/datasource/characters/remote/characters-remote-datasource-imp';
import { CharactersRemoteDataSource } from '@data/datasource/characters/source/characters-remote-datasource';
import { CharactersLocalDataSource } from '@data/datasource/characters/source/characters-local-datasource';
import { CharactersLocalDataSourceImp } from '@data/datasource/characters/local/characters-remote-datasource-imp';


@NgModule({ imports: [CommonModule], providers: [
        Request,
        GetHasNextAndCharactersUseCase,
        { provide: CharactersRepository, useClass: CharactersImpRepository },
        { provide: CharactersRemoteDataSource, useClass: CharactersRemoteDataSourceImp },
        { provide: CharactersLocalDataSource, useClass: CharactersLocalDataSourceImp },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class CharactersDI {}
