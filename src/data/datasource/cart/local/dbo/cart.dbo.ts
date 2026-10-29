export interface CartDbo {
  version: 1;
  id?: number;
  userId: number;
  items: {
    productId: number;
    title: string;
    thumbnail: string;
    price: number;
    discountPercentage: number;
    quantity: number;
  }[];
  // IDs returned by POST are simulated and cannot subsequently be PUT/DELETEd.
  simulated: boolean;
}
