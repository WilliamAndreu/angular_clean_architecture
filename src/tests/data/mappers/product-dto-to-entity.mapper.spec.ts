import { describe, it, expect } from 'vitest';
import { ProductDtoToEntityMapper } from 'src/data/repositories/products/mappers/product-dto-to-entity.mapper';
import { ProductDto } from 'src/data/datasource/products/remote/dto/product.dto';
import { ProductsDto } from 'src/data/datasource/products/remote/dto/products.dto';
import { ProductEntity } from 'src/domain/entities/products/product-entity.model';

const mockProductDto: ProductDto = {
  id: 1,
  title: 'Test Product',
  description: 'A test product',
  price: 29.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 100,
  brand: 'TestBrand',
  category: 'electronics',
  thumbnail: 'https://example.com/thumb.jpg',
  images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  availabilityStatus: 'In Stock',
  tags: ['test', 'product'],
};

describe('ProductDtoToEntityMapper — mapFrom', () => {
  const mapper = new ProductDtoToEntityMapper();

  it('maps all fields correctly', () => {
    const entity = mapper.mapFrom(mockProductDto);
    expect(entity.id).toBe(1);
    expect(entity.title).toBe('Test Product');
    expect(entity.description).toBe('A test product');
    expect(entity.price).toBe(29.99);
    expect(entity.discountPercentage).toBe(10);
    expect(entity.rating).toBe(4.5);
    expect(entity.stock).toBe(100);
    expect(entity.brand).toBe('TestBrand');
    expect(entity.category).toBe('electronics');
    expect(entity.thumbnail).toBe('https://example.com/thumb.jpg');
    expect(entity.images).toEqual(['https://example.com/img1.jpg', 'https://example.com/img2.jpg']);
    expect(entity.availabilityStatus).toBe('In Stock');
    expect(entity.tags).toEqual(['test', 'product']);
  });

  it('defaults brand to empty string when undefined', () => {
    const dto = { ...mockProductDto, brand: undefined as unknown as string };
    expect(mapper.mapFrom(dto).brand).toBe('');
  });

  it('defaults tags to empty array when undefined', () => {
    const dto = { ...mockProductDto, tags: undefined as unknown as string[] };
    expect(mapper.mapFrom(dto).tags).toEqual([]);
  });

  it('preserves zero stock', () => {
    const dto = { ...mockProductDto, stock: 0 };
    expect(mapper.mapFrom(dto).stock).toBe(0);
  });

  it('preserves zero discountPercentage', () => {
    const dto = { ...mockProductDto, discountPercentage: 0 };
    expect(mapper.mapFrom(dto).discountPercentage).toBe(0);
  });

  it('preserves empty images array', () => {
    const dto = { ...mockProductDto, images: [] };
    expect(mapper.mapFrom(dto).images).toEqual([]);
  });
});

describe('ProductDtoToEntityMapper — mapTo', () => {
  const mapper = new ProductDtoToEntityMapper();

  it('maps entity back to DTO shape', () => {
    const entity: ProductEntity = {
      id: 2,
      title: 'Entity Product',
      description: 'desc',
      price: 15,
      discountPercentage: 5,
      rating: 3.8,
      stock: 20,
      brand: 'BrandY',
      category: 'clothing',
      thumbnail: 'thumb.jpg',
      images: ['img.jpg'],
      availabilityStatus: 'Low Stock',
      tags: ['sale'],
    };
    const dto = mapper.mapTo(entity);
    expect(dto.id).toBe(2);
    expect(dto.title).toBe('Entity Product');
    expect(dto.price).toBe(15);
    expect(dto.brand).toBe('BrandY');
  });
});

describe('ProductDtoToEntityMapper — mapListFrom', () => {
  const mapper = new ProductDtoToEntityMapper();

  it('maps a list with one product', () => {
    const dto: ProductsDto = { products: [mockProductDto], total: 1, skip: 0, limit: 20 };
    const result = mapper.mapListFrom(dto);
    expect(result.products).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.skip).toBe(0);
    expect(result.limit).toBe(20);
    expect(result.products[0].title).toBe('Test Product');
  });

  it('maps an empty products list', () => {
    const dto: ProductsDto = { products: [], total: 0, skip: 0, limit: 20 };
    const result = mapper.mapListFrom(dto);
    expect(result.products).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('maps pagination fields correctly', () => {
    const dto: ProductsDto = { products: [mockProductDto], total: 100, skip: 20, limit: 20 };
    const result = mapper.mapListFrom(dto);
    expect(result.skip).toBe(20);
    expect(result.total).toBe(100);
  });
});
