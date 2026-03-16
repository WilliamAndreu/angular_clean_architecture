import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { UseCase } from '@interface-core/use-case';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductEntity } from '@models/products/product-entity.model';
import { AppError } from 'src/core/errors/app-error';

@Injectable()
export class GetProductUseCase implements UseCase<number, ProductEntity> {
  private readonly repo = inject(ProductsRepository);

  execute(id: number): Observable<ProductEntity> {
    return this.repo.getProduct(id).pipe(
      catchError((err) => {
        if (err instanceof AppError) return throwError(() => err);
        return throwError(() => new AppError('errors.products.load_failed'));
      }),
    );
  }
}
