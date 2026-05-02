export type ProductId = string;

// Product is the normalized catalog record that the UI renders everywhere.
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

// Cart rows keep only the fields needed for totals and display.
export type CartItem = Pick<Product, "id" | "name" | "price" | "brand"> & {
  quantity: number;
};
