import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Cart } from "./components/Cart";
import { ProductDetail } from "./components/ProductDetail";
import { ProductList } from "./components/ProductList";
import { SearchBar } from "./components/SearchBar";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Skeleton } from "./components/ui/skeleton";
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
      ? (products.find((product) => product.id === selectedProductId) ?? null)
      : null;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

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

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
          <h1 className="font-heading text-2xl">Shop</h1>
          <div className="justify-self-center">
            {!selectedProduct && (
              <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
            )}
          </div>
          <div />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <main className="flex flex-col gap-6">
          {selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              onBack={() => setSelectedProductId(null)}
            />
          ) : loading ? (
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-72 rounded-4xl" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load products</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <ProductList
              products={products}
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart}
              onSelect={(product) => setSelectedProductId(product.id)}
            />
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
    </div>
  );
}

export default App;
