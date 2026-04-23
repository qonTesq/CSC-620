import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";

import type { CartItem, Product } from "../types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
  cartItem: CartItem | undefined;
  onAddToCart: (product: Product, quantity: number) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onSelect: (product: Product) => void;
}

export function ProductCard({
  product,
  cartItem,
  onAddToCart,
  onIncrement,
  onDecrement,
  onSelect,
}: ProductCardProps) {
  const { brand, image, name, price } = product;
  const singleItem = cartItem?.quantity === 1;

  return (
    <Card
      size="sm"
      onClick={() => onSelect(product)}
      className="group flex h-full cursor-pointer flex-col"
    >
      <img
        src={image || "/images/product-placeholder.svg"}
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
            <Button
              size="icon-sm"
              variant={singleItem ? "destructive" : "outline"}
              aria-label={
                singleItem
                  ? `Remove ${name} from cart`
                  : `Decrease quantity of ${name}`
              }
              onClick={(event) => {
                event.stopPropagation();
                onDecrement(product.id);
              }}
            >
              <HugeiconsIcon
                icon={singleItem ? Delete02Icon : MinusSignIcon}
                strokeWidth={2}
              />
            </Button>
            <span
              className="min-w-6 text-center text-sm tabular-nums"
              aria-label={`Quantity ${cartItem.quantity}`}
            >
              {cartItem.quantity}
            </span>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={`Increase quantity of ${name}`}
              onClick={(event) => {
                event.stopPropagation();
                onIncrement(product.id);
              }}
            >
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
            </Button>
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
