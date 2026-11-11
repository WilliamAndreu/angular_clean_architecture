import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ProductEntity } from '@models/products/product-entity.model';
import { ImgFallbackDirective } from '@directives/img-fallback.directive';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [ImgFallbackDirective],
  templateUrl: './product-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class ProductGallery {
  @Input({ required: true }) product!: ProductEntity;
  @Input({ required: true }) activeImage!: number;
  @Output() activeImageChange = new EventEmitter<number>();
}
