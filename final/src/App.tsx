import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  DeskIcon,
  HeadphonesIcon,
  KeyboardIcon,
  Package01Icon,
  ShoppingCart02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import { CartSidebar } from "./components/CartSidebar";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { SearchBar } from "./components/SearchBar";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { SidebarProvider, useSidebar } from "./components/ui/sidebar";
import { Skeleton } from "./components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useCart } from "./hooks/useCart";
import { fetchProducts } from "./lib/products";
import type { Product } from "./types";

const LOAD_ERROR_MESSAGE =
  "Failed to load products. Wait a moment and refresh if the dev servers are still starting.";

const CATEGORY_ICONS: Record<string, IconSvgElement> = {
  Audio: HeadphonesIcon,
  Peripherals: KeyboardIcon,
  Desk: DeskIcon,
  Accessories: Package01Icon,
};

function App() {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={{ "--sidebar-width": "18rem" } as CSSProperties}
    >
      <AppContent />
    </SidebarProvider>
  );
}

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<
    Product["id"] | null
  >(null);

  const { cartItems, addToCart, adjustQuantity, clearCart, total, itemCount } =
    useCart();

  const { isMobile, open, openMobile, setOpen, setOpenMobile, toggleSidebar } =
    useSidebar();
  const cartOpen = isMobile ? openMobile : open;
  const openCart = () => (isMobile ? setOpenMobile(true) : setOpen(true));

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter((category): category is string => Boolean(category)),
    ),
  ];
  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });
  const cartItemsById = new Map(cartItems.map((item) => [item.id, item]));
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  const handleAddToCart = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    openCart();
    toast.success(
      quantity > 1
        ? `Added to Cart: ${quantity} × ${product.name}`
        : `Added to Cart: ${product.name}`,
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
    <>
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-[#f5f5f5]">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4">
            <h1 className="text-2xl leading-none font-black tracking-tighter">
              <span className="relative inline-block">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 24"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute top-[-0.55em] left-0 h-[0.7em] w-full text-primary"
                >
                  <path
                    d="M4 20 C28 2, 72 2, 96 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                amaz
              </span>
              one
            </h1>
            <div className="justify-self-center">
              {!selectedProduct && (
                <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
              )}
            </div>
            <Button
              variant="outline"
              aria-label={`${cartOpen ? "Close" : "Open"} cart (${itemCount} items)`}
              aria-expanded={cartOpen}
              onClick={toggleSidebar}
              className="relative"
            >
              <HugeiconsIcon icon={ShoppingCart02Icon} strokeWidth={2} />
              Cart
              {itemCount > 0 && (
                <Badge className="absolute -right-3 -top-3 h-5 min-w-5 px-1 tabular-nums">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-3">
          {selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              onBack={() => setSelectedProductId(null)}
            />
          ) : loading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            <>
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <TabsList className="w-full bg-background">
                  <TabsTrigger value="all">
                    <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />
                    All
                  </TabsTrigger>
                  {categories.map((category) => {
                    const icon = CATEGORY_ICONS[category];
                    return (
                      <TabsTrigger key={category} value={category}>
                        {icon && <HugeiconsIcon icon={icon} strokeWidth={2} />}
                        {category}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
              {visibleProducts.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      cartItem={cartItemsById.get(product.id)}
                      onAddToCart={handleAddToCart}
                      onAdjustQuantity={adjustQuantity}
                      onSelect={(p) => setSelectedProductId(p.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No products found</p>
              )}
            </>
          )}
        </main>
      </div>

      <CartSidebar
        cartItems={cartItems}
        itemCount={itemCount}
        total={total}
        onAdjustQuantity={adjustQuantity}
        onClear={clearCart}
      />
    </>
  );
}

export default App;
