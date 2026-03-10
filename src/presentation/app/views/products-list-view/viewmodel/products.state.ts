import { computed, signal } from '@angular/core';
import { ProductEntity } from '@models/products/product-entity.model';

export class ProductsState {
  readonly products = signal<ProductEntity[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly currentSkip = signal<number>(0);
  readonly total = signal<number>(0);
  readonly searchTerm = signal<string>('');
  readonly limit = 20;

  readonly hasNextPage = computed(() => this.products().length < this.total());

  readonly filteredProducts = computed<ProductEntity[]>(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.products();
    return this.products().filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term)),
    );
  });
}
