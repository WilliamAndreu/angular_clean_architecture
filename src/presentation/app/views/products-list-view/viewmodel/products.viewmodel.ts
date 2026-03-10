import { inject, Injectable } from '@angular/core';
import { ProductsState } from './products.state';
import { GetProductsUseCase } from '@usecases/products/get-products.usecase';
import { ProductsEntity } from '@models/products/product-entity.model';
import { ViewState } from '@interface-core/view-state';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class ProductsViewModel {
  private readonly getProductsUseCase = inject(GetProductsUseCase);
  private readonly state = new ProductsState();

  readonly viewState: ViewState<ProductsState> = this.state;

  init(): void {
    this.loadProducts(0);
  }

  loadMore(): void {
    if (!this.state.hasNextPage() || this.state.isLoading()) return;
    this.loadProducts(this.state.currentSkip() + this.state.limit);
  }

  updateSearchTerm(term: string): void {
    this.state.searchTerm.set(term);
  }

  private loadProducts(skip: number): void {
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.getProductsUseCase.execute({ limit: this.state.limit, skip }).subscribe({
      next: (data: ProductsEntity) => {
        this.state.products.set(
          skip === 0 ? data.products : [...this.state.products(), ...data.products],
        );
        this.state.total.set(data.total);
        this.state.currentSkip.set(skip);
        this.state.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.state.error.set(err instanceof AppError ? err.messageKey : 'errors.unknown');
        this.state.isLoading.set(false);
      },
    });
  }
}
