import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { PricePipe } from '@pipes/price.pipe';
import { ImgFallbackDirective } from '@directives/img-fallback.directive';
import { CartViewModel } from '../../viewmodel/cart.viewmodel';

@Component({
  selector: 'app-cart-items',
  imports: [RouterLink, TranslatePipe, PricePipe, ImgFallbackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-items.html',
  host: { class: 'block min-w-0' },
})
export class CartItems {
  protected readonly vm = inject(CartViewModel);
}
