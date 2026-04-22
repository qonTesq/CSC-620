import type { Product } from "../types";

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

export function ProductDetail({
  product,
  onAddToCart,
  onBack,
}: ProductDetailProps) {
  const {
    brand,
    description,
    features,
    image,
    name,
    price,
    rating,
    reviewCount,
    specs,
    stock,
  } = product;

  const inStock = stock === undefined || stock > 0;

  return (
    <article className="product-detail">
      <button type="button" className="product-detail__back" onClick={onBack}>
        ← Back to products
      </button>

      <div className="product-detail__body">
        <div className="product-detail__media">
          <img src={image} alt={name} />
        </div>

        <div className="product-detail__info">
          {brand && <p className="product-detail__brand">{brand}</p>}
          <h2>{name}</h2>

          {(rating !== undefined || reviewCount !== undefined) && (
            <p className="product-detail__rating">
              {rating !== undefined && <span>★ {rating.toFixed(1)}</span>}
              {reviewCount !== undefined && (
                <span> ({reviewCount.toLocaleString()} reviews)</span>
              )}
            </p>
          )}

          <p className="product-detail__price">${price.toFixed(2)}</p>
          <p className="product-detail__stock">
            {inStock ? `In stock${stock ? ` (${stock} left)` : ""}` : "Out of stock"}
          </p>

          <p className="product-detail__description">{description}</p>

          {features && features.length > 0 && (
            <section className="product-detail__section">
              <h3>About this item</h3>
              <ul>
                {features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          <button
            type="button"
            className="product-detail__add"
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {specs && Object.keys(specs).length > 0 && (
        <section className="product-detail__section">
          <h3>Specifications</h3>
          <dl className="product-detail__specs">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
