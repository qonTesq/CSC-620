import { useEffect, useState } from "react";

import type { CartItem, Product } from "../types";

const STORAGE_KEY = "shopping-cart";

function readCart(): CartItem[] {
  try {
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
  const [cartItems, setCartItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Keep cart usable in memory when storage is unavailable.
    }
  }, [cartItems]);

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

  const adjustQuantity = (id: Product["id"], delta: 1 | -1) =>
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { cartItems, addToCart, adjustQuantity, clearCart, total, itemCount };
}
