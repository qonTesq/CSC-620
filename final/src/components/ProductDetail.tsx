import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowLeft02Icon,
  MinusSignIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import type { Product } from "../types";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
}

export function ProductDetail({
  product,
  onAddToCart,
  onBack,
}: ProductDetailProps) {
  const {
    brand,
    description,
    features,
    image,
    name,
    price,
    rating,
    reviewCount,
    specs,
  } = product;

  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="self-start">
        <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} />
        Back to products
      </Button>

      <Card>
        <CardContent className="grid gap-6 md:grid-cols-[minmax(0,380px)_1fr] md:py-0">
          <AspectRatio ratio={1} className="overflow-hidden rounded-3xl">
            <img
              src={image || "/images/product-placeholder.svg"}
              alt={name}
              className="size-full object-cover"
            />
          </AspectRatio>

          <div className="flex flex-col gap-3">
            {brand && (
              <div>
                <Badge variant="secondary">{brand}</Badge>
              </div>
            )}
            <h2 className="font-heading text-2xl">{name}</h2>

            {(rating !== undefined || reviewCount !== undefined) && (
              <div className="flex items-center gap-2">
                {rating !== undefined && (
                  <Badge variant="outline">
                    <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
                    {rating.toFixed(1)}
                  </Badge>
                )}
                {reviewCount !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}

            <p className="text-3xl">${price.toFixed(2)}</p>

            <p className="text-sm text-muted-foreground">{description}</p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={`Decrease quantity of ${name}`}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
                </Button>
                <span
                  className="text-sm font-medium tabular-nums"
                  aria-label={`Quantity ${quantity}`}
                >
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={`Increase quantity of ${name}`}
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                >
                  <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                </Button>
              </div>
              <Button onClick={handleAdd}>Add to Cart</Button>
            </div>

            {features && features.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <h3 className="font-heading text-lg">About this item</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>

        {specs && Object.keys(specs).length > 0 && (
          <>
            <Separator />
            <CardContent className="flex flex-col gap-2">
              <h3 className="font-heading text-lg">Specifications</h3>
              <dl className="grid gap-2 sm:grid-cols-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <dt className="text-xs text-muted-foreground">{key}</dt>
                    <dd className="text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
