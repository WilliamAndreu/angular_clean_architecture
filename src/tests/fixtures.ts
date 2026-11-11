import { vi } from 'vitest';
import { of } from 'rxjs';
import { ProductEntity, ProductsEntity } from '@models/products/product-entity.model';
import { UserEntity } from '@models/auth/auth-entity.model';
import { CartEntity, createCart } from '@models/cart/cart.model';
export const product: ProductEntity = {
  id: 1,
  title: 'Product',
  description: 'Description',
  price: 10,
  discountPercentage: 10,
  rating: 4,
  stock: 5,
  brand: 'Brand',
  category: 'beauty',
  thumbnail: 'thumb.jpg',
  images: ['one.jpg', 'two.jpg'],
  availabilityStatus: 'In Stock',
  tags: [],
};
export const page: ProductsEntity = { products: [product], total: 45, skip: 0, limit: 20 };
export const user: UserEntity = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'avatar.jpg',
};
export function productsRepository() {
  return {
    getProducts: vi.fn(() => of(page)),
    getProduct: vi.fn(() => of(product)),
    getCategories: vi.fn(() => of([{ slug: 'beauty', name: 'Beauty' }])),
  };
}
export function authRepository() {
  return {
    login: vi.fn(() => of({ accessToken: 'access', refreshToken: 'refresh', user })),
    getAuthUser: vi.fn(() => of(user)),
    refreshToken: vi.fn(() => of({ accessToken: 'new-access', refreshToken: 'new-refresh' })),
    getAccessToken: vi.fn(() => 'access'),
    restoreSession: vi.fn(() => of(true)),
    logout: vi.fn(() => of(undefined)),
  };
}
export function cartRepository() {
  return {
    getCart: vi.fn(() => of(createCart(1, []))),
    saveCart: vi.fn((cart: CartEntity) => of(cart)),
    clearCart: vi.fn(() => of(undefined)),
  };
}
