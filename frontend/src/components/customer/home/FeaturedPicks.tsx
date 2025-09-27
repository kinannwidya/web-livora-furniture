// src/components/customer/sections/home/FeaturedPicks.tsx

// Imports: router and products hook
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";

// FeaturedPicks section component
export default function FeaturedPicks() {
  // Fetch all products
  const { data: products = [], isLoading, error } = useProducts();

  // Loading state
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <p className="text-sm text-gray-500">Loading…</p>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <p className="text-sm text-red-600">{error.message}</p>
      </section>
    );
  }

  // Filter: only featured products
  const featured = products.filter((p) => p.featured);

  // Take 5 newest product IDs
  const newestIds = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    )
    .slice(0, 5)
    .map((p) => String(p._id));

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-20">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Picks</h2>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-1 md:gap-6 md:grid-cols-4">
        {featured.map((p) => {
          // Price calculation with discount
          const discount = Math.min(Math.max(p.discount || 0, 0), 100);
          const hasDiscount = discount > 0;
          const finalPrice = hasDiscount
            ? Math.round((p.price || 0) * (1 - discount / 100))
            : p.price;

          return (
            <Link
              key={String(p._id)}
              to={`/product/${p._id}`}
              className="relative group h-50 md:h-72 w-full overflow-hidden border border-gray-200 hover:border-gray-300 transition"
            >
              {/* Product image */}
              <img
                src={p.imageUrl}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition" />

              {/* Discount badge */}
              {hasDiscount && (
                <span className="absolute top-2 left-2 z-20 px-2 py-0.5 text-xs font-medium bg-purple-900 text-white shadow">
                  -{discount}%
                </span>
              )}

              {/* New badge */}
              {newestIds.includes(String(p._id)) && (
                <span className="absolute top-2 right-2 z-20 px-2 py-0.5 text-xs font-medium bg-pink-500 text-white shadow">
                  NEW
                </span>
              )}

              {/* Product info */}
              <div className="absolute bottom-0 p-3 md:p-4 z-20 text-white">
                <h3 className="text-sm md:text-md font-semibold line-clamp-1">
                  {p.name}
                </h3>
                <div className="mt-1 flex flex-col md:flex-row md:items-baseline md:gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="line-through text-xs md:text-sm text-gray-300">
                        Rp {p.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm md:text-base font-bold">
                        Rp {finalPrice.toLocaleString("id-ID")}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm md:text-base font-bold">
                      Rp {p.price.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Empty state */}
        {!featured.length && (
          <div className="text-sm text-gray-500">No featured products yet.</div>
        )}
      </div>
    </section>
  );
}
