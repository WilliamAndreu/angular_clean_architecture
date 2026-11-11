import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Component, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { ProductDetailViewModel } from './viewmodel/product-detail.viewmodel';
import { DetailHeader } from '@shared/components/detail-header/detail-header';
import { ProductGallery } from './components/product-gallery/product-gallery';
import { ProductInfo } from './components/product-info/product-info';
import { ProductDetailSkeleton } from './components/product-detail-skeleton/product-detail-skeleton';
import { ProductDetailError } from './components/product-detail-error/product-detail-error';

@Component({
  selector: 'app-product-detail-view',
  imports: [
    TranslatePipe,
    RouterLink,
    DetailHeader,
    ProductGallery,
    ProductInfo,
    ProductDetailSkeleton,
    ProductDetailError,
  ],
  providers: [ProductDetailViewModel],
  templateUrl: './product-detail-view.html',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProductDetailView {
  readonly id = input.required<string>();
  protected readonly vm = inject(ProductDetailViewModel);

  constructor() {
    effect(() => this.vm.load(Number(this.id())));
  }
}
