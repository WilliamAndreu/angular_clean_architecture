export interface CartProductDto {
  id: number;
  title: string;
  price: number;
  quantity: number;
  discountPercentage: number;
  thumbnail: string;
}
export interface CartDto {
  id: number;
  userId: number;
  products: CartProductDto[];
}
export interface CartRequestDto {
  userId: number;
  products: { id: number; quantity: number }[];
}
export interface CartPageDto {
  carts: CartDto[];
}
