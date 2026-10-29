export interface ProductQuery {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
  sortBy?: 'title' | 'price' | 'rating';
  order?: 'asc' | 'desc';
}

export interface ProductCategory {
  slug: string;
  name: string;
}
