interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <input
      className="search-bar"
      type="text"
      aria-label="Search products"
      placeholder="Search products"
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
