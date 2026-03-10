import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductEntity } from '@models/products/product-entity.model';
import { PricePipe } from '@pipes/price.pipe';
import { ImgFallbackDirective } from '@directives/img-fallback.directive';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, PricePipe, ImgFallbackDirective],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  standalone: true,
})
export class ProductCard {
  readonly product = input.required<ProductEntity>();
}
