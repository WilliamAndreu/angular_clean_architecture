export function calcOriginalPrice(price: number, discountPercentage: number): number {
  return price / (1 - discountPercentage / 100);
}
