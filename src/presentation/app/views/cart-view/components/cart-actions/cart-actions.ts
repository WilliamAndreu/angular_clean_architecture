import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CartViewModel } from '../../viewmodel/cart.viewmodel';

@Component({
  selector: 'app-cart-actions',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-actions.html',
  host: { class: 'block min-w-0' },
})
export class CartActions {
  protected readonly vm = inject(CartViewModel);
}
