// Imports: React hooks, router, icons, API, types, and assets
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import api from "../../../services/api";
import type { Product } from "../../../types";
import summerlivora from "../../../assets/summer-livora.webp";

// Props for HeroSection
type Props = {
  q: string;
  setQ: (value: string) => void;
};

// HeroSection component (hero banner + search + CTA)
export default function HeroSection({ q, setQ }: Props) {
  // Suggestions state
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // Fetch product suggestions with debounce (300ms)
  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await api.get<Product[]>(`/products/search?q=${q}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Hero search error:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [q]);

  // Clear search input & suggestions
  const handleClear = () => {
    setQ("");
    setSuggestions([]);
  };

  return (
    <section className="relative h-[420px] md:h-[640px] flex items-center overflow-hidden">
      {/* Background image + gradient overlay */}
      <img
        src={summerlivora}
        alt="Spring collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Hero content */}
      <div className="z-10 relative max-w-3xl px-4 md:px-16 w-full">
        <p className="text-xs md:text-sm uppercase tracking-wide text-purple-200 font-medium">
          New Arrivals
        </p>
        <h1 className="text-3xl md:text-6xl font-bold text-white leading-tight mt-2 md:mt-3">
          Spring Collection
        </h1>

        {/* Search box */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 md:mt-8 relative"
        >
          <div className="bg-white/95 backdrop-blur border border-gray-200 shadow-sm relative flex items-center">
            {/* Input */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: white wooden chair, marble table..."
              className="flex-1 px-3 py-3 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              aria-label="Search products"
            />

            {/* Clear button */}
            {q && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}

            {/* Search button/icon */}
            <button
              type="submit"
              className="px-4 text-purple-900 hover:text-purple-700 transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Dropdown suggestions */}
          {suggestions.length > 0 && (
            <>
              {/* Mobile dropdown */}
              <div className="absolute mt-1 w-full bg-white border border-gray-200 divide-y divide-gray-100 shadow-lg z-50 md:hidden max-h-[180px] overflow-y-auto">
                {suggestions.map((s) => (
                  <Link
                    key={s._id}
                    to={`/product/${s._id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-gray-100 overflow-hidden">
                      {s.imageUrl && (
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-800 line-clamp-1">
                      {s.name}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop dropdown */}
              <div className="hidden md:block absolute mt-1 w-full bg-white border border-gray-200 divide-y divide-gray-100 shadow-lg z-50 max-h-[220px] overflow-y-auto">
                {suggestions.map((s) => (
                  <Link
                    key={s._id}
                    to={`/product/${s._id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                  >
                    <div className="w-12 h-12 bg-gray-100 overflow-hidden">
                      {s.imageUrl && (
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-800 line-clamp-1">
                      {s.name}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </form>

        {/* Call-to-action button */}
        <div className="mt-6 md:mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 md:px-6 py-3 bg-gray-900 text-white text-sm font-semibold hover:bg-purple-800 transition-colors"
          >
            Shop Now
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
