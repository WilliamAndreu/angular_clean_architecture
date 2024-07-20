import { Component, HostListener, OnInit } from '@angular/core';
import { CharactersEntity } from '@models/characters/characters-entity.model';
import { CharactersViewModel } from '@views/characters-list-view/viewmodel/characters.viewmodel';

@Component({
  selector: 'app-characters-list-view',
  templateUrl: './characters-list-view.component.html',
  styleUrls: ['./characters-list-view.component.scss'],
})
export class CharactersListViewComponent implements OnInit {
  public charactersList?: CharactersEntity;
  public searchTerm = '';

  constructor(private viewModel: CharactersViewModel) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isScrolledToBottom() && this.searchTerm === '') {
      this.viewModel.loadMoreCharacters();
    }
  }

  ngOnInit(): void {
    this.viewModel.charactersSubject!.subscribe((value) => {
      this.charactersList = value;
    });
  }

  private isScrolledToBottom(): boolean {
    return window.innerHeight + window.scrollY >= document.body.scrollHeight;
  }
}
