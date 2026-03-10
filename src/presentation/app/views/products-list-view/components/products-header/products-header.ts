import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './products-header.html',
  styleUrl: './products-header.scss',
})
export class ProductsHeader {
  @Input({ required: true }) searchTerm!: string;
  @Input({ required: true }) resultsCount!: number;
  @Output() searchChange = new EventEmitter<string>();
}
