export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  features?: string[];
  specs?: Record<string, string>;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
}
