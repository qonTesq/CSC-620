import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

interface QuantityStepperProps {
  quantity: number;
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
  removeOnZero?: boolean;
  max?: number;
}

export function QuantityStepper({
  quantity,
  label,
  onIncrement,
  onDecrement,
  size = "sm",
  removeOnZero = false,
  max,
}: QuantityStepperProps) {
  // Switch the left button between decrement and remove when the cart item reaches one.
  const buttonSize = size === "sm" ? "icon-sm" : "icon";
  const showRemove = removeOnZero && quantity === 1;
  // Keep the lower bound at one unless the caller wants the control to remove the item.
  const atMin = !removeOnZero && quantity <= 1;
  // Honor a caller-provided upper bound for detail and bulk-add flows.
  const atMax = max !== undefined && quantity >= max;

  return (
    <>
      <Button
        size={buttonSize}
        variant={showRemove ? "destructive" : "outline"}
        aria-label={
          showRemove
            ? `Remove ${label} from cart`
            : `Decrease quantity of ${label}`
        }
        disabled={atMin}
        onClick={onDecrement}
      >
        <HugeiconsIcon
          icon={showRemove ? Delete02Icon : MinusSignIcon}
          strokeWidth={2}
        />
      </Button>
      <span
        className="min-w-6 text-center text-sm tabular-nums"
        aria-label={`Quantity ${quantity}`}
      >
        {/* Show the current amount in a stable, easy-to-scan layout. */}
        {quantity}
      </span>
      <Button
        size={buttonSize}
        variant="outline"
        aria-label={`Increase quantity of ${label}`}
        disabled={atMax}
        onClick={onIncrement}
      >
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
      </Button>
    </>
  );
}
