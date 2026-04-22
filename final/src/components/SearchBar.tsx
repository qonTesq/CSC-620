import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="relative w-full min-w-72 max-w-lg sm:w-96">
      <HugeiconsIcon
        icon={Search01Icon}
        strokeWidth={2}
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="text"
        aria-label="Search products"
        placeholder="Search products"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="pl-9"
      />
    </div>
  );
}
