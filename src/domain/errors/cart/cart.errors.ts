import { BadRequestError, ConflictError, NotFoundError } from 'src/domain/errors/app-error';
export class InvalidCartQuantityError extends BadRequestError {
  constructor() {
    super('errors.cart.invalid_quantity', undefined, { code: 'CART_INVALID_QUANTITY' });
  }
}
export class InsufficientStockError extends ConflictError {
  constructor() {
    super('errors.cart.insufficient_stock', undefined, { code: 'CART_INSUFFICIENT_STOCK' });
  }
}
export class CartItemNotFoundError extends NotFoundError {
  constructor() {
    super('errors.cart.item_not_found', undefined, { code: 'CART_ITEM_NOT_FOUND' });
  }
}
