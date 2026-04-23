import type { CartItem, Product } from "../types";

import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  cartItems: CartItem[];
  searchQuery: string;
  onAddToCart: (product: Product, quantity: number) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onSelect: (product: Product) => void;
}

export function ProductList({
  products,
  cartItems,
  searchQuery,
  onAddToCart,
  onIncrement,
  onDecrement,
  onSelect,
}: ProductListProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery),
      )
    : products;

  const cartItemsById = new Map(cartItems.map((item) => [item.id, item]));

  return filteredProducts.length > 0 ? (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cartItem={cartItemsById.get(product.id)}
          onAddToCart={onAddToCart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onSelect={onSelect}
        />
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground">No products found</p>
  );
}
