import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PricePipe } from '@pipes/price.pipe';
import { CartViewModel } from '../../viewmodel/cart.viewmodel';

@Component({
  selector: 'app-cart-summary',
  imports: [TranslatePipe, PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-summary.html',
  host: { class: 'block min-w-0' },
})
export class CartSummary {
  protected readonly vm = inject(CartViewModel);
}
