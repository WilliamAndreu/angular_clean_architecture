import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail-skeleton',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './product-detail-skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ProductDetailSkeleton {}
