import type { Product } from "../types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
    <Card size="sm" className="flex h-full flex-col">
      <img
        src={image || "/images/product-placeholder.svg"}
        alt={name}
        onClick={() => onSelect(product)}
        className="aspect-square w-full cursor-pointer object-cover"
      />
      <CardHeader>
        <CardTitle className="line-clamp-2">{name}</CardTitle>
        {brand && (
          <div>
            <Badge variant="secondary">{brand}</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-lg">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onAddToCart(product, 1)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
