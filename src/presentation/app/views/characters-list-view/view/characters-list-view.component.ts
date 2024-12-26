import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CharactersEntity } from '@models/characters/characters-entity.model';
import { CharactersViewModel } from '@views/characters-list-view/viewmodel/characters.viewmodel';

@Component({
    selector: 'app-characters-list-view',
    templateUrl: './characters-list-view.component.html',
    styleUrls: ['./characters-list-view.component.scss'],
    standalone: false
})
export class CharactersListViewComponent implements OnInit {
  searchTermSignal = signal('');


  constructor(public viewModel: CharactersViewModel) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isScrolledToBottom() && this.searchTermSignal() === '') {
      this.viewModel.loadMoreCharacters();
    }
  }

  ngOnInit(): void {
   
  }

  updateSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTermSignal.set(input.value);
  }

  private isScrolledToBottom(): boolean {
    return window.innerHeight + window.scrollY >= document.body.scrollHeight;
  }
}
