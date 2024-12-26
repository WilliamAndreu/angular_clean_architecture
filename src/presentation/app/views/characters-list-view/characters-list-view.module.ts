import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersListViewComponent } from './view/characters-list-view.component';
import { CharactersViewModel } from '@views/characters-list-view/viewmodel/characters.viewmodel';
import { FormsModule } from '@angular/forms';
import { CharactersListViewRoutingModule } from './characters-list-view-routing.module';
import { PipesModule } from '@pipes/pipes.module';
import { CharactersDI } from '@di/characters.di';

@NgModule({
  declarations: [CharactersListViewComponent],
  imports: [
    CharactersListViewRoutingModule,
    CommonModule,
    CharactersDI,
    FormsModule,
    PipesModule,
  ],
  providers: [CharactersViewModel],
})
export class CharactersModule {}
