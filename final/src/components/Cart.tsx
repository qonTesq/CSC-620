import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";

import type { CartItem } from "../types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartProps {
  cartItems: CartItem[];
  total: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onClear: () => void;
}

export function Cart({
  cartItems,
  total,
  onIncrement,
  onDecrement,
  onClear,
}: CartProps) {
  const isEmpty = cartItems.length === 0;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card
      aria-label="Shopping cart"
      className="lg:sticky lg:top-24 lg:self-start"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cart</CardTitle>
        <span className="text-sm text-muted-foreground">
          {itemCount} item(s)
        </span>
      </CardHeader>

      {isEmpty ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">Cart is empty</p>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <ScrollArea className="max-h-[50vh] pr-3">
              <ul className="flex flex-col gap-4">
                {cartItems.map((item) => {
                  const singleItem = item.quantity === 1;

                  return (
                    <li key={item.id} className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                          {item.brand && (
                            <span className="text-xs text-muted-foreground">
                              {item.brand}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          aria-label={
                            singleItem
                              ? `Remove ${item.name} from cart`
                              : `Decrease quantity of ${item.name}`
                          }
                          onClick={() => onDecrement(item.id)}
                        >
                          <HugeiconsIcon
                            icon={singleItem ? Delete02Icon : MinusSignIcon}
                            strokeWidth={2}
                          />
                        </Button>
                        <span
                          className="min-w-6 text-center text-sm"
                          aria-label={`Quantity ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => onIncrement(item.id)}
                        >
                          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </CardContent>

          <Separator />

          <CardFooter className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <strong className="font-heading text-lg">
              ${total.toFixed(2)}
            </strong>
          </CardFooter>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={onClear}
            >
              Clear cart
            </Button>
          </CardContent>
        </>
      )}
    </Card>
  );
}
