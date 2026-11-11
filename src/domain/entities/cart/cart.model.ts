export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
}
export interface CartEntity {
  id?: number;
  userId: number;
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  total: number;
}
const money = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
export function createCart(userId: number, items: CartItem[], id?: number): CartEntity {
  return {
    id,
    userId,
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: money(items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
    total: money(
      items.reduce(
        (sum, item) => sum + item.price * item.quantity * (1 - item.discountPercentage / 100),
        0,
      ),
    ),
  };
}
