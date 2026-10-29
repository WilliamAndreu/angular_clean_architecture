import { computed, signal } from '@angular/core';
import { ProductEntity } from '@models/products/product-entity.model';
import { ProductCategory, ProductQuery } from '@models/products/product-query.model';

export class ProductsState {
  readonly products = signal<ProductEntity[]>([]);
  readonly categories = signal<ProductCategory[]>([]);
  readonly category = signal('');
  readonly sortBy = signal<NonNullable<ProductQuery['sortBy']>>('title');
  readonly order = signal<'asc' | 'desc'>('asc');
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly categoriesError = signal(false);
  readonly currentSkip = signal(0);
  readonly total = signal(0);
  readonly searchTerm = signal('');
  readonly limit = 20;
  readonly hasNextPage = computed(() => this.products().length < this.total());
  readonly filteredProducts = this.products.asReadonly();
}
