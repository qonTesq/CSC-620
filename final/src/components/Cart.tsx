import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";

import type { CartItem } from "../types";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartBodyProps {
  cartItems: CartItem[];
  total: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onClear: () => void;
}

export function CartBody({
  cartItems,
  total,
  onIncrement,
  onDecrement,
  onClear,
}: CartBodyProps) {
  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 px-6">
        <ul className="flex flex-col gap-4 pb-4">
          {cartItems.map((item) => {
            const singleItem = item.quantity === 1;

            return (
              <li key={item.id} className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
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
                    variant={singleItem ? "destructive" : "outline"}
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
                    className="min-w-6 text-center text-sm tabular-nums"
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

      <Separator />

      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <strong className="text-lg">${total.toFixed(2)}</strong>
        </div>
        <Button variant="destructive" className="w-full" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
