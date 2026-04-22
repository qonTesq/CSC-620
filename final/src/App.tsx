import { useEffect, useState } from "react";

import "./App.css";
import { Cart } from "./components/Cart";
import { ProductDetail } from "./components/ProductDetail";
import { ProductList } from "./components/ProductList";
import { SearchBar } from "./components/SearchBar";
import { useCart } from "./hooks/useCart";
import { fetchProducts } from "./lib/products";
import type { Product } from "./types";

const LOAD_ERROR_MESSAGE =
  "Failed to load products. Wait a moment and refresh if the dev servers are still starting.";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const { cartItems, addToCart, increment, decrement, clearCart, total } =
    useCart();

  const selectedProduct =
    selectedProductId !== null
      ? products.find((product) => product.id === selectedProductId) ?? null
      : null;

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    async function loadProducts() {
      try {
        setError("");
        const loadedProducts = await fetchProducts(signal);

        if (!signal.aborted) {
          setProducts(loadedProducts);
          setLoading(false);
        }
      } catch {
        if (!signal.aborted) {
          setError(LOAD_ERROR_MESSAGE);
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => abortController.abort();
  }, []);

  const statusMessage = loading ? "Loading..." : error;

  return (
    <div className="app-shell">
      <main className="catalog">
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={addToCart}
            onBack={() => setSelectedProductId(null)}
          />
        ) : (
          <>
            <header className="catalog__header">
              <h1>Browse products and build your cart</h1>
              <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
            </header>

            {statusMessage ? (
              <p className="catalog__status">{statusMessage}</p>
            ) : (
              <ProductList
                products={products}
                searchQuery={searchQuery}
                onAddToCart={addToCart}
                onSelect={(product) => setSelectedProductId(product.id)}
              />
            )}
          </>
        )}
      </main>

      <Cart
        cartItems={cartItems}
        total={total}
        onIncrement={increment}
        onDecrement={decrement}
        onClear={clearCart}
      />
    </div>
  );
}

export default App;
