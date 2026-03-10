export interface ProductsEntity {
  products: ProductEntity[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductEntity {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  availabilityStatus: string;
  tags: string[];
}
