import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersListViewComponent } from './view/characters-list-view.component';
import { CharactersViewModel } from '@views/characters-list-view/viewmodel/characters.viewmodel';
import { DataModule } from '@data/data.module';
import { FormsModule } from '@angular/forms';
import { CharactersListViewRoutingModule } from './characters-list-view-routing.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [CharactersListViewComponent],
  imports: [
    CharactersListViewRoutingModule,
    CommonModule,
    DataModule,
    FormsModule,
    PipesModule,
  ],
  providers: [CharactersViewModel],
})
export class CharactersModule {}
