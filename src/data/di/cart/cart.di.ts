import { CartLocalDataSourceImp } from 'src/data/datasource/cart/local/cart-local.datasource.imp';
import { CartRemoteDataSourceImp } from 'src/data/datasource/cart/remote/cart-remote.datasource.imp';
import { makeEnvironmentProviders } from '@angular/core';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { CartRepository } from '@repositories/cart/cart.repository';
import { ProductsRepository } from '@repositories/products/products.repository';
import { GetCartUseCase } from '@usecases/cart/get-cart.usecase';
import { ChangeCartItemUseCase } from '@usecases/cart/change-cart-item.usecase';
import { ClearCartUseCase } from '@usecases/cart/clear-cart.usecase';
import { CartRepositoryImp } from 'src/data/repositories/cart/cart.repository.imp';
import { CartLocalDataSource } from 'src/data/datasource/cart/source/cart-local.source';
import { CartRemoteDataSource } from 'src/data/datasource/cart/source/cart-remote.source';
export function provideCartDI() {
  return makeEnvironmentProviders([
    { provide: CartLocalDataSource, useClass: CartLocalDataSourceImp },
    { provide: CartRemoteDataSource, useClass: CartRemoteDataSourceImp },
    { provide: CartRepository, useClass: CartRepositoryImp },
    {
      provide: GetCartUseCase,
      useFactory: (auth: AuthRepository, carts: CartRepository) => new GetCartUseCase(auth, carts),
      deps: [AuthRepository, CartRepository],
    },
    {
      provide: ClearCartUseCase,
      useFactory: (auth: AuthRepository, carts: CartRepository) =>
        new ClearCartUseCase(auth, carts),
      deps: [AuthRepository, CartRepository],
    },
    {
      provide: ChangeCartItemUseCase,
      useFactory: (auth: AuthRepository, carts: CartRepository, products: ProductsRepository) =>
        new ChangeCartItemUseCase(auth, carts, products),
      deps: [AuthRepository, CartRepository, ProductsRepository],
    },
  ]);
}
