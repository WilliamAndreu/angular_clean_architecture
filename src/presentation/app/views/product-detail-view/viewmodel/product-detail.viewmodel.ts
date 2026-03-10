import { inject, Injectable } from '@angular/core';
import { ProductDetailState } from './product-detail.state';
import { GetProductUseCase } from '@usecases/products/get-product.usecase';
import { ViewState } from '@interface-core/view-state';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class ProductDetailViewModel {
  private readonly getProductUseCase = inject(GetProductUseCase);
  private readonly state = new ProductDetailState();

  readonly viewState: ViewState<ProductDetailState> = this.state;

  load(id: number): void {
    this.state.isLoading.set(true);
    this.state.error.set(null);

    this.getProductUseCase.execute(id).subscribe({
      next: (product) => {
        this.state.product.set(product);
        this.state.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.state.error.set(err instanceof AppError ? err.messageKey : 'errors.unknown');
        this.state.isLoading.set(false);
      },
    });
  }

  setActiveImage(index: number): void {
    this.state.activeImage.set(index);
  }
}
