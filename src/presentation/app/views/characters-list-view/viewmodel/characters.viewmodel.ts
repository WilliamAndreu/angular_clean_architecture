import { Injectable } from '@angular/core';
import { GetHasNextAndCharactersUseCase } from '@usecases/characters/get-hasnext-and-characters.usecase';
import { CharactersEntity } from '@models/characters/characters-entity.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CharactersViewModel {
  public charactersSubject = new BehaviorSubject<CharactersEntity>(
    {} as CharactersEntity
  );
  constructor(
    private getHasNextAndCharactersUseCase: GetHasNextAndCharactersUseCase
  ) {
    this.initViewModel();
  }

  initViewModel() {
    this.getCharacters(1);
  }

  public loadMoreCharacters(): void {
    if (this.hasMoreCharacters()) {
      const nextPage = this.getPageNumberFromUrl(
        this.charactersSubject?.value?.info!.next!
      );
      this.getCharacters(nextPage);
    }
  }
  private getCharacters(page: number) {
    this.getHasNextAndCharactersUseCase
      .execute({ page, needRequest: true })
      .subscribe((value) => {
        this.charactersSubject?.next(value);
      });
  }
  private hasMoreCharacters(): boolean {
    return !!this.charactersSubject?.value?.info?.next;
  }

  private getPageNumberFromUrl(url: string): number {
    const match = url.match(/page=(\d+)/);
    return match ? +match[1] : 1;
  }
}
