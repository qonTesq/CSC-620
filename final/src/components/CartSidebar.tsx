import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";

import type { CartItem } from "../types";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface CartSidebarProps {
  cartItems: CartItem[];
  total: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onClear: () => void;
}

export function CartSidebar({
  cartItems,
  total,
  onIncrement,
  onDecrement,
  onClear,
}: CartSidebarProps) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = cartItems.length === 0;

  return (
    <Sidebar side="right" collapsible="offcanvas" className="border-l">
      <SidebarHeader className="gap-1 p-6 pb-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Cart</h2>
        <p className="text-sm text-muted-foreground">
          {itemCount} item(s) in your cart
        </p>
      </SidebarHeader>

      <SidebarContent className="px-6">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">Cart is empty</p>
        ) : (
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
        )}
      </SidebarContent>

      {!isEmpty && (
        <>
          <Separator />
          <SidebarFooter className="gap-3 p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-muted-foreground">
                Total
              </span>
              <span className="font-heading text-lg font-semibold">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button variant="destructive" className="w-full" onClick={onClear}>
              Clear
            </Button>
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}
