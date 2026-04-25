import type { Product } from "../types";

const API_URL = "http://localhost:3001/products";
export const PRODUCT_PLACEHOLDER_IMAGE = "/images/product-placeholder.svg";

type ProductResponse = Omit<Product, "id"> & { id: number | string };

function normalizeProducts(products: unknown): Product[] {
  if (!Array.isArray(products)) {
    throw new Error("Invalid product payload");
  }

  return products.map((product) => {
    const normalizedProduct = product as ProductResponse;
    return {
      ...normalizedProduct,
      id: String(normalizedProduct.id),
    };
  });
}

export async function fetchProducts(signal: AbortSignal): Promise<Product[]> {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return normalizeProducts(await response.json());
}
