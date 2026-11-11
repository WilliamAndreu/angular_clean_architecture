import { CartSkeleton } from './components/cart-skeleton/cart-skeleton';
import { CartActions } from './components/cart-actions/cart-actions';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DetailHeader } from '../../../shared/components/detail-header/detail-header';
import { TranslatePipe } from '@ngx-translate/core';
import { CartFeedback } from './components/cart-feedback/cart-feedback';
import { CartItems } from './components/cart-items/cart-items';
import { CartSummary } from './components/cart-summary/cart-summary';
import { CartViewModel } from './viewmodel/cart.viewmodel';
@Component({
  selector: 'app-cart-view',
  imports: [
    DetailHeader,
    TranslatePipe,
    CartFeedback,
    CartItems,
    CartSummary,
    CartActions,
    CartSkeleton,
  ],
  providers: [CartViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-view.html',
  host: { class: 'block min-w-0' },
})
export class CartView implements OnInit {
  protected readonly vm = inject(CartViewModel);
  ngOnInit(): void {
    this.vm.load();
  }
}
