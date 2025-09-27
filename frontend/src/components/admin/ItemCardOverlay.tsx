// Import ItemCard component and its type
import ItemCard, { type SimpleItem } from "./ItemCard";

// Props for ItemCardOverlay
type Props = {
  item: SimpleItem;
  manageMode?: boolean;
  onEdit: (item: SimpleItem) => void;
  onDelete: (id: string) => void;
  onToggleFeatured?: (item: SimpleItem) => void;
};

// ItemCardOverlay component (adds overlay effect to ItemCard)
export default function ItemCardOverlay({
  item,
  manageMode,
  onEdit,
  onDelete,
  onToggleFeatured,
}: Props) {
  return (
    // Wrapper with scale and shadow for overlay styling
    <div className="scale-105 opacity-75 shadow-2xl">
      <ItemCard
        item={item}
        manageMode={manageMode}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFeatured={onToggleFeatured}
      />
    </div>
  );
}
