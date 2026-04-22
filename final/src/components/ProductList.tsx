import type { Product } from "../types";

import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  searchQuery: string;
  onAddToCart: (product: Product) => void;
  onSelect: (product: Product) => void;
}

export function ProductList({
  products,
  searchQuery,
  onAddToCart,
  onSelect,
}: ProductListProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery),
      )
    : products;

  return filteredProducts.length > 0 ? (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onSelect={onSelect}
        />
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground">No products found</p>
  );
}
