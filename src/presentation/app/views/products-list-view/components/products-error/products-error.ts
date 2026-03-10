import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products-error',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './products-error.html',
  styleUrl: './products-error.scss',
})
export class ProductsError {
  @Input({ required: true }) message!: string;
}
