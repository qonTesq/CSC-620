import type { CartItem } from "../types";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { QuantityStepper } from "./QuantityStepper";

interface CartSidebarProps {
  cartItems: CartItem[];
  itemCount: number;
  total: number;
  onAdjustQuantity: (id: CartItem["id"], delta: 1 | -1) => void;
  onClear: () => void;
}

export function CartSidebar({
  cartItems,
  itemCount,
  total,
  onAdjustQuantity,
  onClear,
}: CartSidebarProps) {
  const isEmpty = cartItems.length === 0;
  const itemLabel = itemCount === 1 ? "item" : "items";

  return (
    <Sidebar side="right" collapsible="offcanvas" className="border-l">
      <SidebarHeader className="gap-1 p-6 pb-4">
        <h2 className="font-heading text-2xl tracking-tight">Cart</h2>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemLabel} in your cart
        </p>
      </SidebarHeader>

      <SidebarContent className="px-6">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">Cart is empty</p>
        ) : (
          <ul className="flex flex-col gap-4 pb-4">
            {cartItems.map((item) => (
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
                  <QuantityStepper
                    quantity={item.quantity}
                    label={item.name}
                    removeOnZero
                    onIncrement={() => onAdjustQuantity(item.id, 1)}
                    onDecrement={() => onAdjustQuantity(item.id, -1)}
                  />
                </div>
              </li>
            ))}
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
