import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ProductCard from "../../components/customer/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types";

export default function ProductsPage() {
  // Fetch products with React Query
  const { data: products = [], isLoading, error } = useProducts();

  // Local state for search, sort, and filtering
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default");
  const [discountOnly, setDiscountOnly] = useState(false);

  const navigate = useNavigate();

  // ✅ Derived list: search, filter, and sort products
  const sortedAndFilteredProducts = useMemo(() => {
    let list: Product[] = [...products];

    // Search filter (matches name or description)
    if (q.trim()) {
      list = list.filter((p) =>
        [p.name, p.description ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    }

    // Discount filter
    if (discountOnly) {
      list = list.filter((p) => (p.discount ?? 0) > 0);
    }

    // Sorting logic
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
        break;
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
        );
        break;
      default:
        break;
    }

    return list;
  }, [products, q, sort, discountOnly]);

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-800 mb-6 mt-2"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        {/* Page header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-lg text-gray-600 mb-10">
          Discover our full collection of high-quality furniture.
        </p>

        {/* Filters and search bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-9 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {/* Search icon (left) */}
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            {/* Clear button (right) */}
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Right side: Discount filter + Sort dropdown */}
          <div className="flex items-center gap-4">
            {/* Discount filter */}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={(e) => setDiscountOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              On Sale
            </label>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                id="sort-by"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="py-2 pl-3 pr-8 border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              {/* Dropdown arrow */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Product grid / loading / error / empty states */}
        {isLoading ? (
          // Skeleton loaders while fetching
          <div className="grid gap-1 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-72 w-full bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center text-red-600">
            Error: {error.message}
          </div>
        ) : sortedAndFilteredProducts.length === 0 ? (
          // Empty state after filtering
          <div className="text-center text-gray-500">No products found.</div>
        ) : (
          // Product grid
          <div className="grid gap-1 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedAndFilteredProducts.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
