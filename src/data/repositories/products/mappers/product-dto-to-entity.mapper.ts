import { Injectable } from '@angular/core';
import { Mapper } from '@interface-core/mapper';
import { ProductDto } from '@data/datasource/products/remote/dto/product.dto';
import { ProductsDto } from '@data/datasource/products/remote/dto/products.dto';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';

@Injectable()
export class ProductDtoToEntityMapper extends Mapper<ProductDto, ProductEntity> {
  mapFrom(dto: ProductDto): ProductEntity {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      discountPercentage: dto.discountPercentage,
      rating: dto.rating,
      stock: dto.stock,
      brand: dto.brand ?? '',
      category: dto.category,
      thumbnail: dto.thumbnail,
      images: dto.images,
      availabilityStatus: dto.availabilityStatus,
      tags: dto.tags ?? [],
    };
  }

  mapTo(entity: ProductEntity): ProductDto {
    return entity as ProductDto;
  }

  mapListFrom(dto: ProductsDto): ProductsEntity {
    return {
      products: dto.products.map((p) => this.mapFrom(p)),
      total: dto.total,
      skip: dto.skip,
      limit: dto.limit,
    };
  }
}
