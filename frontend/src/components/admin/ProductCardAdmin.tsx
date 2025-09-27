import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator, MdStar, MdStarBorder } from "react-icons/md";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import type { CategoryDoc, Product as BaseProduct } from "../../types";

export type ProductDoc = BaseProduct & {
  _id: string;
  name: string;
  imageUrl?: string;
  featured?: boolean;
  order?: number;
  category?: CategoryDoc | string;
};

// Get category name safely
function categoryName(p: ProductDoc) {
  return typeof p.category === "object" && p.category
    ? (p.category as CategoryDoc).name
    : "";
}

export default function ProductCard({
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: product._id,
      disabled: !manageMode,
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.9 : 1,
    cursor: manageMode ? "grab" : "default",
    boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.15)" : undefined,
    zIndex: isDragging ? 50 : "auto",
    transformOrigin: "center",
  };

  const discount = Math.min(Math.max(product.discount || 0, 0), 100);
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? Math.round((product.price || 0) * (1 - discount / 100))
    : product.price;
  const outOfStock = (product.stock ?? 0) <= 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white border hover:shadow-sm transition"
    >
      {/* Drag handle khusus (disable scroll hanya di sini) */}
      {manageMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-20 p-1 bg-white/80 backdrop-blur-sm hover:bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
          title="Drag to reorder"
        >
          <MdDragIndicator className="w-5 h-5 text-gray-600" />
        </div>
      )}

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

      {/* Actions */}
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
    </div>
  );
}
