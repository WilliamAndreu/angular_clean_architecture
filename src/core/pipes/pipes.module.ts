import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterCharactersByNamePipe } from './filter-characters-by-name.pipe';
import { SecurePipe } from './auth-image.pipe';

@NgModule({
  declarations: [FilterCharactersByNamePipe, SecurePipe],
  imports: [CommonModule],
  exports: [FilterCharactersByNamePipe, SecurePipe],
})
export class PipesModule {}
