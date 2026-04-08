import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { description, image, name, price } = product;

  return (
    <article className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="product-card__price">${price.toFixed(2)}</p>
      <p className="product-card__description">{description}</p>
      <button type="button" onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </article>
  );
}
