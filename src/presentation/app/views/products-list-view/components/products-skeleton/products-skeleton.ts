import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products-skeleton',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './products-skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ProductsSkeleton {
  protected readonly placeholders = [0, 1, 2, 3, 4, 5, 6, 7];
}
