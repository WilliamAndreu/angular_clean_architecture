import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './products-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ProductsHeader {
  @Input({ required: true }) searchTerm!: string;
  @Input({ required: true }) resultsCount!: number;
  @Output() searchChange = new EventEmitter<string>();
}
