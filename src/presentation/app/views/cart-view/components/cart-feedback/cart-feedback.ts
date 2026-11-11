import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CartViewModel } from '../../viewmodel/cart.viewmodel';

@Component({
  selector: 'app-cart-feedback',
  imports: [TranslatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-feedback.html',
  host: { class: 'block min-w-0' },
})
export class CartFeedback {
  protected readonly vm = inject(CartViewModel);
}
