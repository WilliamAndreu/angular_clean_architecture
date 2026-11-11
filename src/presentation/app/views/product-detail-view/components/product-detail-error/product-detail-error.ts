import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail-error',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './product-detail-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ProductDetailError {
  @Input({ required: true }) message!: string;
}
