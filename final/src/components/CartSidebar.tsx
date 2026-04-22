import type { CartItem } from "../types";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CartBody } from "./Cart";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  total: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onClear: () => void;
}

export function CartSidebar({
  open,
  onOpenChange,
  cartItems,
  total,
  onIncrement,
  onDecrement,
  onClear,
}: CartSidebarProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const description = `${itemCount} item(s) in your cart`;

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex h-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-2xl">Cart</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <CartBody
            cartItems={cartItems}
            total={total}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onClear={onClear}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">Cart</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <CartBody
          cartItems={cartItems}
          total={total}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onClear={onClear}
        />
      </DrawerContent>
    </Drawer>
  );
}
