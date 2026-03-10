import { Component, Input } from '@angular/core';
import { ProductEntity } from '@models/products/product-entity.model';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.scss',
})
export class ProductsGrid {
  @Input({ required: true }) products!: ProductEntity[];
  @Input({ required: true }) searchTerm!: string;
}
