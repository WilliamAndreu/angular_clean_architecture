import { Component, Input } from '@angular/core';
import { ProductEntity } from '@models/products/product-entity.model';
import { PricePipe } from '@pipes/price.pipe';
import { calcOriginalPrice } from '@utils/calc-original-price.util';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [PricePipe, TranslatePipe],
  templateUrl: './product-info.html',
  styleUrl: './product-info.scss',
})
export class ProductInfo {
  @Input({ required: true }) product!: ProductEntity;

  protected readonly calcOriginalPrice = calcOriginalPrice;
}
