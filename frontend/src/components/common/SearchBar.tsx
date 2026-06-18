import type { ComponentPropsWithoutRef } from "react";

interface SearchBarProps extends ComponentPropsWithoutRef<"input"> {
  onSearch?: (value: string) => void;
}

export function SearchBar({ className = "", placeholder = "Search services...", onSearch, ...props }: SearchBarProps) {
  return (
    <div className={`flex items-center bg-surface-container-low px-4 py-2.5 rounded-full border border-outline-variant/20 focus-within:border-primary/40 focus-within:bg-white focus-within:shadow-sm transition-all duration-300 ${className}`}>
      <span className="material-symbols-outlined text-outline text-xl select-none">search</span>
      <input
        type="text"
        className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm ml-2 w-full text-on-surface placeholder:text-on-surface-variant/50"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </div>
  );
}

export default SearchBar;
