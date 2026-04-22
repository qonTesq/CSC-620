import { useEffect, useState } from "react";

import type { CartItem, Product } from "../types";

const STORAGE_KEY = "shopping-cart";

function readCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    (item.brand === undefined || typeof item.brand === "string")
  );
}

function changeQuantity(cartItems: CartItem[], id: number, step: 1 | -1) {
  return cartItems
    .map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + step } : item,
    )
    .filter((item) => item.quantity > 0);
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage failures so cart interactions still work in memory.
    }
  }, [cartItems]);

  const addToCart = (product: Product) =>
    setCartItems((currentItems) =>
      currentItems.some((item) => item.id === product.id)
        ? changeQuantity(currentItems, product.id, 1)
        : [
            ...currentItems,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              brand: product.brand,
            },
          ],
    );

  const increment = (id: number) =>
    setCartItems((currentItems) => changeQuantity(currentItems, id, 1));

  const decrement = (id: number) =>
    setCartItems((currentItems) => changeQuantity(currentItems, id, -1));

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    cartItems,
    addToCart,
    increment,
    decrement,
    clearCart,
    total,
  };
}
