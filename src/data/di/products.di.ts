import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductsImpRepository } from '@data/repositories/products/products-implementation.repository';
import { ProductsRemoteDataSource } from '@data/datasource/products/source/products-remote.datasource';
import { ProductsRemoteDataSourceImp } from '@data/datasource/products/remote/products-remote.datasource.imp';
import { ProductsLocalDataSource } from '@data/datasource/products/source/products-local.datasource';
import { ProductsLocalDataSourceImp } from '@data/datasource/products/local/products-local.datasource.imp';
import { ProductDtoToEntityMapper } from '@data/repositories/products/mappers/product-dto-to-entity.mapper';
import { ProductDboToEntityMapper } from '@data/repositories/products/mappers/product-dbo-to-entity.mapper';
import { GetProductsUseCase } from '@usecases/products/get-products.usecase';
import { GetProductUseCase } from '@usecases/products/get-product.usecase';

export function provideProductsDI(): EnvironmentProviders {
  return makeEnvironmentProviders([
    GetProductsUseCase,
    GetProductUseCase,
    ProductDtoToEntityMapper,
    ProductDboToEntityMapper,
    { provide: ProductsRepository, useClass: ProductsImpRepository },
    { provide: ProductsRemoteDataSource, useClass: ProductsRemoteDataSourceImp },
    { provide: ProductsLocalDataSource, useClass: ProductsLocalDataSourceImp },
  ]);
}
