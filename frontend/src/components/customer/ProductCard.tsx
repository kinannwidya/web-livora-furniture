// Imports: router, types, and custom hook
import { Link } from "react-router-dom";
import type { Product } from "../../types";
import useNewestProducts from "../../hooks/useNewestProducts";

// ProductCard component
export default function ProductCard({ p }: { p: Product }) {
  // Handle discount logic
  const discount = Math.min(Math.max(p.discount || 0, 0), 100);
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? Math.round((p.price || 0) * (1 - discount / 100))
    : p.price;

  // Stock check
  const outOfStock = (p.stock ?? 0) <= 0;

  // Dummy rating & reviews
  const rating = 4.2;
  const reviews = 128;

  // Fetch newest product IDs
  const { newestIds } = useNewestProducts(5);

  return (
    <Link
      to={`/product/${p._id}`}
      className="group bg-white border border-gray-200 hover:border-gray-300 transition-colors block"
    >
      {/* Image + Badges */}
      <div className="relative aspect-square overflow-hidden">
        {/* Product image */}
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 grid place-items-center text-xs text-gray-400">
            No Image
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs bg-purple-900 text-white">
            -{discount}%
          </span>
        )}

        {/* New badge */}
        {newestIds.includes(String(p._id)) && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs bg-pink-500 text-white shadow">
            NEW
          </span>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/80 grid place-items-center text-sm font-medium text-gray-800">
            Out of Stock
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 flex flex-col">
        {/* Rating & reviews */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={i < Math.round(rating) ? "currentColor" : "none"}
              stroke="currentColor"
              className="w-4 h-4 text-yellow-500"
            >
              <path
                fillRule="evenodd"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 
                3.967a1 1 0 00.95.69h4.178c.969 0 
                1.371 1.24.588 1.81l-3.385 2.462a1 
                1 0 00-.364 1.118l1.286 3.966c.3.922-.755 
                1.688-1.54 1.118l-3.386-2.462a1 1 0 
                00-1.176 0l-3.386 2.462c-.785.57-1.84-.196-1.54-1.118l1.286-3.966a1 
                1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 
                1 0 00.95-.69l1.286-3.967z"
                clipRule="evenodd"
              />
            </svg>
          ))}
          <span>{rating.toFixed(1)}</span>
          <span className="text-gray-400">({reviews})</span>
        </div>

        {/* Product name */}
        <h3 className="text-md font-semibold text-gray-900 group-hover:text-purple-900 transition-colors line-clamp-2">
          {p.name}
        </h3>

        {/* Price */}
        <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-baseline md:gap-2">
          {hasDiscount ? (
            <>
              <span className="line-through text-sm text-gray-500">
                Rp {p.price.toLocaleString("id-ID")}
              </span>
              <span className="text-base font-bold text-purple-900">
                Rp {finalPrice.toLocaleString("id-ID")}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-purple-900">
              Rp {p.price.toLocaleString("id-ID")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
