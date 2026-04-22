import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon } from "@hugeicons/core-free-icons";

import { CartSidebar } from "./components/CartSidebar";
import { ProductDetail } from "./components/ProductDetail";
import { ProductList } from "./components/ProductList";
import { SearchBar } from "./components/SearchBar";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
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
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, addToCart, increment, decrement, clearCart, total } =
    useCart();

  const selectedProduct =
    selectedProductId !== null
      ? (products.find((product) => product.id === selectedProductId) ?? null)
      : null;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    toast.success(
      quantity > 1
        ? `Added ${quantity} × ${product.name} to cart.`
        : `Added ${product.name} to cart.`,
      {
        action: {
          label: "View",
          onClick: () => setCartOpen(true),
        },
      },
    );
  };

  useEffect(() => {
    if (cartOpen) toast.dismiss();
  }, [cartOpen]);

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
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4">
          <h1 className="font-heading text-2xl">AmaZone</h1>
          <div className="justify-self-center">
            {!selectedProduct && (
              <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
            )}
          </div>
          <Button
            variant="outline"
            aria-label={`Open cart (${itemCount} items)`}
            onClick={() => setCartOpen(true)}
            className="relative"
          >
            <HugeiconsIcon icon={ShoppingCart02Icon} strokeWidth={2} />
            Cart
            {itemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1 tabular-nums">
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setSelectedProductId(null)}
          />
        ) : loading ? (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
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

      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
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
