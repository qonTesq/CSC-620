import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const [draft, setDraft] = useState(query);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onQueryChange(draft.trim());
      }}
      className="w-full min-w-72 max-w-lg sm:w-96"
    >
      <Field>
        <FieldLabel htmlFor="product-search" className="sr-only">
          Search
        </FieldLabel>
        <ButtonGroup>
          <Input
            id="product-search"
            type="search"
            placeholder="Search Amazone"
            className="bg-background"
            value={draft}
            onChange={(event) => {
              const next = event.target.value;
              setDraft(next);
              if (!next) onQueryChange("");
            }}
          />
          <Button type="submit" aria-label="Search">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </Field>
    </form>
  );
}
