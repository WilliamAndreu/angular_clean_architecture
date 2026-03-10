import { signal } from '@angular/core';
import { ProductEntity } from '@models/products/product-entity.model';

export class ProductDetailState {
  readonly product = signal<ProductEntity | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly activeImage = signal<number>(0);
}
