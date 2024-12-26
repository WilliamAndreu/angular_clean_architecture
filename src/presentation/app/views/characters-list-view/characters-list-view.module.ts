import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersListViewComponent } from './view/characters-list-view.component';
import { CharactersViewModel } from '@views/characters-list-view/viewmodel/characters.viewmodel';
import { FormsModule } from '@angular/forms';
import { CharactersListViewRoutingModule } from './characters-list-view-routing.module';
import { CharactersDI } from '@di/characters.di';
import { FilterCharactersByNamePipe } from '@pipes/filter-characters-by-name.pipe';

@NgModule({
  declarations: [CharactersListViewComponent],
  imports: [
    CharactersListViewRoutingModule,
    CommonModule,
    CharactersDI,
    FormsModule,
    FilterCharactersByNamePipe,
  ],
  providers: [CharactersViewModel],
})
export class CharactersModule {}
