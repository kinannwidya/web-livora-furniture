// Import types and libraries
import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator, MdPushPin } from "react-icons/md";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

// Define item structure
export type SimpleItem = {
  _id: string;
  key: string;
  name: string;
  imageUrl?: string;
  featured?: boolean;
  order?: number;
};

// Props for the component
type Props = {
  item: SimpleItem;
  manageMode?: boolean;
  disabledDrag?: boolean;
  invalidDrop?: boolean;
  onEdit: (item: SimpleItem) => void;
  onDelete: (id: string) => void;
  onToggleFeatured?: (item: SimpleItem) => void;
};

// ItemCard component
export default function ItemCard({
  item,
  manageMode,
  disabledDrag,
  invalidDrop,
  onEdit,
  onDelete,
  onToggleFeatured,
}: Props) {

  // Setup drag & drop behavior
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item._id,
    disabled: !manageMode || !!disabledDrag,
  });

  // Dynamic style while dragging
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.9 : 1,
    cursor: manageMode ? "grab" : "default",
    boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.15)" : undefined,
    zIndex: isDragging ? 50 : "auto",
    transformOrigin: "center",
    ...(isDragging ? { scale: "1.02" } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 hover:shadow-sm transition ${invalidDrop ? "border-2 border-red-500 bg-red-50" : "border bg-white"
        }`}
    >
      {/* Drag handle (top-left) */}
      {manageMode && (
        <div className="absolute top-2 left-2 z-10">
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-100 cursor-grab active:cursor-grabbing bg-white/70 backdrop-blur-sm touch-none"
            title="Drag to reorder"
            type="button"
          >
            <MdDragIndicator className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Featured pin (top-right) */}
      {manageMode ? (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => onToggleFeatured?.(item)}
            className={`p-1.5 transition-colors shadow-sm ${item.featured
              ? "bg-purple-700 text-white hover:bg-purple-900"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
            title="Toggle Featured"
            type="button"
          >
            <MdPushPin className="w-4 h-4" />
          </button>
        </div>
      ) : (
        item.featured && (
          <div className="absolute top-2 right-2 z-10">
            <div
              className="p-1.5 bg-purple-800 text-white shadow-sm"
              title="Featured"
            >
              <MdPushPin className="w-4 h-4" />
            </div>
          </div>
        )
      )}

      {/* Image preview or placeholder */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full aspect-square object-cover mb-3"
        />
      ) : (
        <div className="w-full aspect-square bg-gray-200 grid place-items-center text-xs opacity-70 mb-3">
          No Image
        </div>
      )}

      {/* Item name & key */}
      <div className="flex-1">
        <div className="font-semibold text-gray-900 text-lg line-clamp-1">
          {item.name}
        </div>
        <div className="text-sm text-gray-500">{item.key}</div>
      </div>

      {/* Action buttons (Edit & Delete) */}
      <div className="mt-3 flex justify-end items-center gap-2">
        <button
          className="text-red-500 hover:text-red-700 transition-colors"
          onClick={() => onDelete(item._id)}
          title="Delete"
          type="button"
        >
          <TrashIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => onEdit(item)}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          title="Edit"
          type="button"
        >
          <PencilIcon className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
}
