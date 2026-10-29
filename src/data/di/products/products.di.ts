import { GetCategoriesUseCase } from '@usecases/products/get-categories.usecase';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProductsRepository } from '@repositories/products/products.repository';
import { ProductsRepositoryImp } from 'src/data/repositories/products/products.repository.imp';
import { ProductsRemoteDataSource } from 'src/data/datasource/products/source/products-remote.source';
import { ProductsRemoteDataSourceImp } from '@data/datasource/products/remote/products-remote.datasource.imp';
import { ProductsLocalDataSource } from 'src/data/datasource/products/source/products-local.source';
import { ProductsLocalDataSourceImp } from '@data/datasource/products/local/products-local.datasource.imp';
import { ProductDtoToEntityMapperImp } from 'src/data/repositories/products/mappers/product-dto-to-entity.mapper.imp';
import { ProductDboToEntityMapperImp } from 'src/data/repositories/products/mappers/product-dbo-to-entity.mapper.imp';
import { GetProductsUseCase } from '@usecases/products/get-products.usecase';
import { GetProductUseCase } from '@usecases/products/get-product.usecase';

export function provideProductsDI(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: GetProductsUseCase,
      useFactory: (repo: ProductsRepository) => new GetProductsUseCase(repo),
      deps: [ProductsRepository],
    },
    {
      provide: GetProductUseCase,
      useFactory: (repo: ProductsRepository) => new GetProductUseCase(repo),
      deps: [ProductsRepository],
    },
    {
      provide: GetCategoriesUseCase,
      useFactory: (repo: ProductsRepository) => new GetCategoriesUseCase(repo),
      deps: [ProductsRepository],
    },
    ProductDtoToEntityMapperImp,
    ProductDboToEntityMapperImp,
    { provide: ProductsRepository, useClass: ProductsRepositoryImp },
    { provide: ProductsRemoteDataSource, useClass: ProductsRemoteDataSourceImp },
    { provide: ProductsLocalDataSource, useClass: ProductsLocalDataSourceImp },
  ]);
}
