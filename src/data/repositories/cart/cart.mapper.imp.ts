import { CartEntity, createCart } from '@models/cart/cart.model';
import { CartDto, CartRequestDto } from '@data/datasource/cart/remote/dto/cart.dto';
import { CartDbo } from 'src/data/datasource/cart/local/dbo/cart.dbo';
export class CartMapperImp {
  fromDto(dto: CartDto): CartEntity {
    return createCart(
      dto.userId,
      dto.products.map((p) => ({
        productId: p.id,
        title: p.title,
        thumbnail: p.thumbnail,
        price: p.price,
        discountPercentage: p.discountPercentage ?? 0,
        quantity: p.quantity,
      })),
      dto.id,
    );
  }
  fromDbo(dbo: CartDbo): CartEntity {
    return createCart(
      dbo.userId,
      dbo.items.map((item) => ({ ...item })),
      dbo.id,
    );
  }
  toDbo(cart: CartEntity, simulated: boolean): CartDbo {
    return {
      version: 1,
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item) => ({ ...item })),
      simulated,
    };
  }
  toDto(cart: CartEntity): CartRequestDto {
    return {
      userId: cart.userId,
      products: cart.items.map((item) => ({ id: item.productId, quantity: item.quantity })),
    };
  }
}
