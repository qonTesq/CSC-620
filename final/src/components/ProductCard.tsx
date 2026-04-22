import type { Product } from "../types";

import { AspectRatio } from "@/components/ui/aspect-ratio";
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
  onAddToCart: (product: Product) => void;
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
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="block text-left"
      >
        <AspectRatio ratio={1}>
          <img src={image} alt={name} className="size-full object-cover" />
        </AspectRatio>
      </button>
      <CardHeader>
        <CardTitle className="line-clamp-2">{name}</CardTitle>
        {brand && (
          <div>
            <Badge variant="secondary">{brand}</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="font-heading text-lg">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
