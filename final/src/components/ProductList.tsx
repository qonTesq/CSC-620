import type { Product } from "../types";

import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export function ProductList({
  products,
  searchQuery,
  onAddToCart,
}: ProductListProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery),
      )
    : products;

  return filteredProducts.length > 0 ? (
    <div className="product-grid">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  ) : (
    <p className="products-empty">No products found</p>
  );
}
