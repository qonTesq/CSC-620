import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelect: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onSelect,
}: ProductCardProps) {
  const { brand, image, name, price } = product;

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__link"
        onClick={() => onSelect(product)}
      >
        <img src={image} alt={name} />
        <h3>{name}</h3>
      </button>
      {brand && <p className="product-card__brand">{brand}</p>}
      <p className="product-card__price">${price.toFixed(2)}</p>
      <button type="button" onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </article>
  );
}
