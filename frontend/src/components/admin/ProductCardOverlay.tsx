// ProductCardOverlay.tsx
import { MdStar, MdStarBorder } from "react-icons/md";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import type { ProductDoc } from "./ProductCardAdmin";

function categoryName(p: ProductDoc) {
  return typeof p.category === "object" && p.category
    ? p.category.name
    : "";
}

export default function ProductCardOverlay({
  product,
  manageMode,
  onRequestToggleFeatured,
  onDelete,
}: {
  product: ProductDoc;
  manageMode: boolean;
  onRequestToggleFeatured: (p: ProductDoc) => void;
  onDelete: (id: string) => void;
}) {
  const discount = Math.min(Math.max(product.discount || 0, 0), 100);
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? Math.round((product.price || 0) * (1 - discount / 100))
    : product.price;
  const outOfStock = (product.stock ?? 0) <= 0;

  return (
    <div
      className="relative bg-white border max-w-[90vw] w-40 sm:w-48 md:w-56 shadow-lg"
      style={{
        opacity: 0.75,
        transform: "scale(1.02)",
      }}
    >
      {/* Featured star toggle */}
      <button
        onClick={() => onRequestToggleFeatured(product)}
        className={`absolute top-2 right-2 z-20 p-1.5 shadow-sm ${
          product.featured
            ? "bg-yellow-500 text-white"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
        }`}
        title={product.featured ? "Unfeature" : "Make Featured"}
        type="button"
      >
        {product.featured ? (
          <MdStar className="w-4 h-4" />
        ) : (
          <MdStarBorder className="w-4 h-4" />
        )}
      </button>

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 grid place-items-center text-xs text-gray-400">
            No Image
          </div>
        )}

        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs bg-purple-900 text-white z-10">
            -{discount}%
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-white/80 grid place-items-center text-sm font-medium text-gray-800 z-10">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        <div className="font-semibold text-gray-900 text-base line-clamp-1 pr-10">
          {product.name}
        </div>
        {categoryName(product) && (
          <div className="text-sm text-gray-500 capitalize">
            {categoryName(product)}
          </div>
        )}

        <div className="mt-1 flex flex-col md:flex-row md:items-baseline md:gap-2">
          {hasDiscount ? (
            <>
              <span className="text-sm text-gray-500 line-through">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              <span className="text-md font-bold text-purple-900">
                Rp {finalPrice.toLocaleString("id-ID")}
              </span>
            </>
          ) : (
            <span className="text-md font-bold text-purple-900">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          )}
        </div>
      </div>

      {manageMode && (
        <div className="px-4 pb-4 flex justify-end items-center gap-2">
          <button
            className="text-red-500 hover:text-red-700 transition-colors"
            onClick={() => onDelete(product._id)}
            title="Delete"
            type="button"
          >
            <TrashIcon className="w-5 h-5" />
          </button>

          <Link
            to={`/admin/edit/${product._id}`}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </Link>
        </div>
      )}
    </div>
  );
}
