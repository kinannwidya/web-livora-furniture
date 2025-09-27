// Imports: router, icons, product card, and hook
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import ProductCard from "../ProductCard";
import { useProducts } from "../../../hooks/useProducts";

// HotProducts section component
export default function HotProducts() {
  // Fetch products data
  const { data: products = [], isLoading, error } = useProducts();

  return (
    <section id="products" className="max-w-7xl mx-auto px-6 md:px-20">
      {/* Header with title + link */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hot Products</h2>
        <Link
          to="/products"
          className="text-sm text-purple-900 hover:text-purple-700 flex items-center gap-1"
        >
          All products
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Product grid states */}
      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-72 w-full bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        // Error state
        <div className="text-red-600">{error.message}</div>
      ) : (
        // Loaded products (max 12)
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.slice(0, 12).map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}
