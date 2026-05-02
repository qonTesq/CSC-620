import { useEffect, useState } from "react";

import type { CartItem, Product } from "../types";

const STORAGE_KEY = "shopping-cart";

function readCart(): CartItem[] {
  try {
    // Hydrate safely so a malformed localStorage entry never breaks the cart.
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.map(normalizeCartItem).filter((item): item is CartItem => !!item)
      : [];
  } catch {
    return [];
  }
}

function normalizeCartItem(value: unknown): CartItem | null {
  // Reject anything that does not look like a stored cart row.
  if (!value || typeof value !== "object") return null;

  const item = value as Record<string, unknown>;
  const { id, name, price, quantity, brand } = item;

  if (
    (typeof id !== "number" && typeof id !== "string") ||
    typeof name !== "string" ||
    typeof price !== "number" ||
    typeof quantity !== "number" ||
    quantity <= 0
  ) {
    return null;
  }

  return {
    id: String(id),
    name,
    price,
    quantity,
    ...(typeof brand === "string" ? { brand } : {}),
  };
}

export function useCart() {
  // Start from persisted state when available, then keep everything local to the hook.
  const [cartItems, setCartItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    try {
      // Persist the latest cart state, but keep the in-memory cart if storage fails.
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Keep cart usable in memory when storage is unavailable.
    }
  }, [cartItems]);

  // Merge quantities when the product already exists in the cart.
  const addToCart = (product: Product, quantity = 1) =>
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          brand: product.brand,
        },
      ];
    });

  // Step items up or down, removing rows that hit zero.
  const adjustQuantity = (id: Product["id"], delta: 1 | -1) =>
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );

  // Clear the cart in one shot.
  const clearCart = () => setCartItems([]);

  // Derive totals from the current cart instead of storing duplicate state.
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { cartItems, addToCart, adjustQuantity, clearCart, total, itemCount };
}
