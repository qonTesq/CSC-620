export type ProductId = string;

export interface Product {
  id: ProductId;
  name: string;
  price: number;
  description: string;
  image: string;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  specs?: Record<string, string>;
}

export type CartItem = Pick<Product, "id" | "name" | "price" | "brand"> & {
  quantity: number;
};
