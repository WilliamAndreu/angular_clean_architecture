import { Injectable } from '@angular/core';
import { Mapper } from 'src/domain/interfaces/mapper';
import { ProductDbo } from '@data/datasource/products/local/dbo/product.dbo';
import { ProductsDbo } from '@data/datasource/products/local/dbo/products.dbo';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';

@Injectable()
export class ProductDboToEntityMapperImp extends Mapper<ProductDbo, ProductEntity> {
  mapFrom(dbo: ProductDbo): ProductEntity {
    return {
      id: dbo.id,
      title: dbo.title,
      description: dbo.description,
      price: dbo.price,
      discountPercentage: dbo.discountPercentage,
      rating: dbo.rating,
      stock: dbo.stock,
      brand: dbo.brand ?? '',
      category: dbo.category,
      thumbnail: dbo.thumbnail,
      images: dbo.images,
      availabilityStatus: dbo.availabilityStatus,
      tags: dbo.tags ?? [],
    };
  }

  mapTo(entity: ProductEntity): ProductDbo {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      price: entity.price,
      discountPercentage: entity.discountPercentage,
      rating: entity.rating,
      stock: entity.stock,
      brand: entity.brand,
      category: entity.category,
      thumbnail: entity.thumbnail,
      images: [...entity.images],
      availabilityStatus: entity.availabilityStatus,
      tags: [...entity.tags],
    };
  }

  mapListFrom(dbo: ProductsDbo): ProductsEntity {
    return {
      products: dbo.products.map((p) => this.mapFrom(p)),
      total: dbo.total,
      skip: dbo.skip,
      limit: dbo.limit,
    };
  }
}
