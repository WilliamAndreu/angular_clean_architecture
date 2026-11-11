import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, timer } from 'rxjs';
import { ProductsState } from './products.state';
import { GetProductsUseCase } from '@usecases/products/get-products.usecase';
import { GetCategoriesUseCase } from '@usecases/products/get-categories.usecase';
import { ViewState } from 'src/core/models/types/view/view-state.type';
import { ErrorHandlingSource } from 'src/core/services/error-handling/source/error-handling.source';
import { ProductQuery } from '@models/products/product-query.model';

@Injectable()
export class ProductsViewModel {
  private readonly getProducts = inject(GetProductsUseCase);
  private readonly getCategories = inject(GetCategoriesUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly errors = inject(ErrorHandlingSource);
  private readonly state = new ProductsState();
  private request?: Subscription;
  private searchTimer?: Subscription;
  readonly viewState: ViewState<ProductsState> = this.state;

  init(): void {
    this.loadCategories();
    this.loadProducts(0);
  }
  loadCategories(): void {
    this.state.categoriesError.set(false);
    this.getCategories
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => this.state.categories.set(categories),
        error: (err: unknown) => {
          this.errors.handle(err, { source: 'operation', operation: 'products.categories' });
          this.state.categoriesError.set(true);
        },
      });
  }
  loadMore(): void {
    if (this.state.hasNextPage() && !this.state.isLoading())
      this.loadProducts(this.state.currentSkip() + this.state.limit);
  }
  retry(): void {
    this.loadProducts(
      this.state.products().length ? this.state.currentSkip() + this.state.limit : 0,
    );
  }
  updateSearchTerm(term: string): void {
    this.state.searchTerm.set(term);
    this.request?.unsubscribe();
    this.searchTimer?.unsubscribe();
    this.state.products.set([]);
    this.state.isLoading.set(true);
    this.searchTimer = timer(300)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadProducts(0));
  }
  updateCategory(category: string): void {
    this.state.category.set(category);
    this.loadProducts(0);
  }
  updateSort(value: string): void {
    const [sortBy, order] = value.split(':');
    if (!['title', 'price', 'rating'].includes(sortBy) || !['asc', 'desc'].includes(order)) return;
    this.state.sortBy.set(sortBy as ProductQuery['sortBy'] & string);
    this.state.order.set(order as 'asc' | 'desc');
    this.loadProducts(0);
  }
  private loadProducts(skip: number): void {
    this.searchTimer?.unsubscribe();
    this.request?.unsubscribe();
    if (skip === 0) this.state.products.set([]);
    this.state.isLoading.set(true);
    this.state.error.set(null);
    this.request = this.getProducts
      .execute({
        limit: this.state.limit,
        skip,
        search: this.state.searchTerm(),
        category: this.state.category(),
        sortBy: this.state.sortBy(),
        order: this.state.order(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.state.products.update((current) =>
            skip === 0 ? data.products : [...current, ...data.products],
          );
          this.state.total.set(data.total);
          this.state.currentSkip.set(skip);
          this.state.isLoading.set(false);
        },
        error: (err: unknown) => {
          this.state.error.set(
            this.errors.handle(err, { source: 'operation', operation: 'products.load' }).messageKey,
          );
          this.state.isLoading.set(false);
        },
      });
  }
}
