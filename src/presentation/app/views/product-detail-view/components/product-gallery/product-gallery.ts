import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEntity } from '@models/products/product-entity.model';
import { ImgFallbackDirective } from '@directives/img-fallback.directive';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [ImgFallbackDirective],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss',
})
export class ProductGallery {
  @Input({ required: true }) product!: ProductEntity;
  @Input({ required: true }) activeImage!: number;
  @Output() activeImageChange = new EventEmitter<number>();
}
