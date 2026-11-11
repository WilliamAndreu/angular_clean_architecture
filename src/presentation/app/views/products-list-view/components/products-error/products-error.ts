import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products-error',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './products-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ProductsError {
  @Input({ required: true }) message!: string;
}
