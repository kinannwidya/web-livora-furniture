// Import ItemForm component and type
import ItemForm, { type ItemFormValue } from "./ItemForm";

// Props for ItemModal
type Props = {
  open: boolean;
  title?: string;
  initial?: Partial<ItemFormValue>;
  submitting?: boolean;
  type: "category" | "room"; // required
  onClose: () => void;
  onSubmit: (val: { key: string; name: string; imageFile: File | null }) => void | Promise<void>;
};

// ItemModal component (wrapper modal for ItemForm)
export default function ItemModal({
  open,
  title = "Edit Item",
  initial,
  submitting,
  type,
  onClose,
  onSubmit,
}: Props) {
  // Hide modal if not open
  if (!open) return null;

  return (
    // Modal overlay
    <div
      className="fixed inset-x-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        top: "var(--nav-h, 56px)",
        height: "calc(100vh - var(--nav-h, 56px))",
        zIndex: 50,
      }}
    >
      {/* Modal box */}
      <div className="bg-white p-6 shadow-lg w-full max-w-3xl border relative">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* ItemForm inside modal */}
        <ItemForm
          mode="edit"
          type={type}
          initial={initial}
          submitting={submitting}
          onSubmit={onSubmit}
        />

        {/* Close button (top-right) */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
          title="Close"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
