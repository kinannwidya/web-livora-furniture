// Imports: React, router, icons, and types
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Product } from "../../types";

// Props for SearchBar
type Props = {
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  suggestions?: Product[];
  onSearch?: (q: string) => void;
};

// SearchBar component
export default function SearchBar({
  placeholder = "Search...",
  size = "md",
  suggestions = [],
  onSearch,
}: Props) {
  // Query state
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Submit handler → navigate to products page with query
  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/products?q=${encodeURIComponent(q)}`);
  }

  // Size-based input styles
  const sizeClasses =
    size === "sm"
      ? "py-1.5 text-sm"
      : size === "lg"
      ? "py-3 text-base"
      : "py-2 text-sm";

  return (
    <div className="relative w-full">
      <form onSubmit={onSubmitSearch}>
        {/* Search icon (left inside input) */}
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

        {/* Input field */}
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onSearch?.(e.target.value);
          }}
          type="text"
          placeholder={placeholder}
          className={`pl-9 pr-9 ${sizeClasses} bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 transition w-full`}
        />

        {/* Clear button (X) */}
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              onSearch?.("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 shadow-lg z-50 divide-y divide-gray-100">
          {suggestions.map((s) => (
            <Link
              key={s._id}
              to={`/product/${s._id}`}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 bg-gray-100 overflow-hidden">
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {/* Product name */}
              <span className="text-sm text-gray-800 line-clamp-1">{s.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
