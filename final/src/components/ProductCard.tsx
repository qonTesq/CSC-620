import type { CartItem, Product } from "../types";
import { PRODUCT_PLACEHOLDER_IMAGE } from "../lib/products";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuantityStepper } from "./QuantityStepper";

interface ProductCardProps {
  product: Product;
  cartItem: CartItem | undefined;
  onAddToCart: (product: Product, quantity: number) => void;
  onAdjustQuantity: (id: Product["id"], delta: 1 | -1) => void;
  onSelect: (product: Product) => void;
}

export function ProductCard({
  product,
  cartItem,
  onAddToCart,
  onAdjustQuantity,
  onSelect,
}: ProductCardProps) {
  const { brand, image, name, price } = product;

  return (
    <Card
      size="sm"
      onClick={() => onSelect(product)}
      className="group flex h-full cursor-pointer flex-col"
    >
      <img
        src={image || PRODUCT_PLACEHOLDER_IMAGE}
        alt={name}
        className="aspect-square w-full object-cover transition-transform duration-300 [.group:hover:not(:has([data-slot=card-footer]:hover))_&]:scale-105"
      />
      <CardHeader className="gap-2">
        {brand && (
          <div>
            <Badge variant="secondary">{brand}</Badge>
          </div>
        )}
        <CardTitle className="line-clamp-2 [.group:hover:not(:has([data-slot=card-footer]:hover))_&]:underline">
          {name}
        </CardTitle>
        <p className="text-lg">${price.toFixed(2)}</p>
      </CardHeader>
      <CardFooter>
        {cartItem ? (
          <div
            className="flex w-full items-center justify-between gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <QuantityStepper
              quantity={cartItem.quantity}
              label={name}
              removeOnZero
              onIncrement={() => onAdjustQuantity(product.id, 1)}
              onDecrement={() => onAdjustQuantity(product.id, -1)}
            />
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart(product, 1);
            }}
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
