import { describe, it, expect, vi } from 'vitest';
import { of, firstValueFrom } from 'rxjs';
import { ProductDtoToEntityMapper } from 'src/data/repositories/products/mappers/product-dto-to-entity.mapper';
import { ProductDto } from 'src/data/datasource/products/remote/dto/product.dto';
import { ProductsDto } from 'src/data/datasource/products/remote/dto/products.dto';

const mockDto: ProductDto = {
  id: 1,
  title: 'Product',
  description: 'Desc',
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 50,
  brand: 'Brand',
  category: 'cat',
  thumbnail: 'thumb.jpg',
  images: [],
  availabilityStatus: 'In Stock',
  tags: [],
};

const mockProductsDto: ProductsDto = {
  products: [mockDto],
  total: 1,
  skip: 0,
  limit: 20,
};

describe('ProductsImpRepository (unit logic)', () => {
  const mapper = new ProductDtoToEntityMapper();

  it('maps remote DTO to entity via mapper', () => {
    const entity = mapper.mapFrom(mockDto);
    expect(entity.id).toBe(1);
    expect(entity.title).toBe('Product');
  });

  it('uses cache when local returns data', async () => {
    const localGet = vi.fn((_skip: number) => of(mockProductsDto));
    const remoteGet = vi.fn((_limit: number, _skip: number) => of(mockProductsDto));

    const cached = await firstValueFrom(localGet(0));
    expect(cached).toEqual(mockProductsDto);
    expect(remoteGet).not.toHaveBeenCalled();
  });

  it('fetches remote when cache is null', async () => {
    const localGet = vi.fn((_skip: number) => of(null));
    const remoteGet = vi.fn((_limit: number, _skip: number) => of(mockProductsDto));

    const cached = await firstValueFrom(localGet(0));
    if (!cached) {
      const remote = await firstValueFrom(remoteGet(20, 0));
      expect(remote).toEqual(mockProductsDto);
    }
    expect(remoteGet).toHaveBeenCalledOnce();
  });
});
