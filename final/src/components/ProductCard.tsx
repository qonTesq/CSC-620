import type { Product } from "../types";

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
  onAddToCart: (product: Product, quantity: number) => void;
  onSelect: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
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
        <Button
          className="w-full"
          onClick={(event) => {
            event.stopPropagation();
            onAddToCart(product, 1);
          }}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
