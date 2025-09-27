import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loadCart, removeItem, setQty, clearCart } from "../../utils/cart";
import {
  ArrowRightIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

/* ----------------------------
   Reusable Confirm Modal
---------------------------- */
function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white p-6 shadow-xl border border-gray-200 animate-fadeIn">
        {/* Close (X) button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
          onClick={onCancel}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Title & message */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------
   Toast with Undo
---------------------------- */
function Toast({
  message,
  onUndo,
  onClose,
}: {
  message: string;
  onUndo?: () => void;
  onClose: () => void;
}) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 shadow-lg z-50 animate-slideUp">
      <div className="flex items-center gap-3">
        <span>{message}</span>

        {onUndo && (
          <button
            onClick={onUndo}
            className="text-purple-300 hover:text-purple-100 font-semibold ml-2"
          >
            Undo
          </button>
        )}

        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------
   Cart Page
---------------------------- */
export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState(loadCart());

  const [showModal, setShowModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const [toast, setToast] = useState<{ msg: string; undo?: () => void } | null>(null);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const total = useMemo(() => {
    return items
      .filter((it) => selectedItems.includes(it.productId))
      .reduce((sum, it) => sum + it.price * it.qty, 0);
  }, [items, selectedItems]);

  // refresh + sort so newest at top
  function sync() {
    const raw = loadCart().map((it: any) => ({
      ...it,
      addedAt: it.addedAt || Date.now(), // inject if missing
    }));
    raw.sort((a, b) => b.addedAt - a.addedAt);
    setItems(raw);
  }

  function handleRemoveItem(productId: string) {
    setProductToRemove(productId);
    setShowModal(true);
  }

  function confirmRemoval() {
    if (productToRemove) {
      const index = items.findIndex((i) => i.productId === productToRemove);
      const target = items[index];
      removeItem(productToRemove);

      setSelectedItems(selectedItems.filter((id) => id !== productToRemove));
      sync();

      setProductToRemove(null);
      setShowModal(false);

      if (target) {
        const snapshot = { ...target };
        setToast({
          msg: "Item removed",
          undo: () => {
            const current = loadCart();
            const updated = [
              ...current.slice(0, index),
              snapshot,
              ...current.slice(index),
            ];
            localStorage.setItem("cart", JSON.stringify(updated));
            sync();
          },
        });
      }
    }
  }

  function confirmClearCart() {
    const snapshot = loadCart();
    clearCart();
    setSelectedItems([]);
    sync();
    setShowClearModal(false);

    setToast({
      msg: "Cart cleared",
      undo: () => {
        localStorage.setItem("cart", JSON.stringify(snapshot));
        sync();
      },
    });
  }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSelectItem(productId: string) {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  }

  function handleSelectAll() {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((it) => it.productId));
    }
    setSelectAll(!selectAll);
  }

  useEffect(() => {
    setSelectAll(items.length > 0 && selectedItems.length === items.length);
  }, [selectedItems, items]);

  return (
    <div className="min-h-screen pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-20">
        {items.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-base sm:text-xl text-gray-500 mb-4">
              Your cart is empty.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-purple-900 hover:text-purple-700 font-medium transition-colors"
            >
              Start shopping <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-800 mb-6"
              >
                <ArrowLeftIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-8">
                Review your items before proceeding to checkout.
              </p>

              {items.map((it) => (
                <div
                  key={it.productId}
                  className="flex items-start gap-4 sm:gap-6 border-b border-gray-200 pb-6 animate-fadeIn"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(it.productId)}
                    onChange={() => handleSelectItem(it.productId)}
                    className="form-checkbox h-5 w-5 text-purple-800 mt-2"
                  />

                  {it.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 grid place-items-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                      {it.name}
                    </h3>

                    <div className="text-sm sm:text-base text-gray-600">
                      Rp {it.price.toLocaleString("id-ID")}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300">
                        <button
                          className="px-2 sm:px-3 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            if (it.qty === 1) {
                              handleRemoveItem(it.productId);
                            } else {
                              setQty(it.productId, it.qty - 1);
                              sync();
                            }
                          }}
                        >
                          −
                        </button>

                        <input
                          className="w-10 sm:w-12 text-center text-sm font-medium focus:outline-none"
                          type="number"
                          min={1}
                          value={it.qty}
                          onChange={(e) => {
                            const newQty = Number(e.target.value);
                            if (newQty < 1) {
                              handleRemoveItem(it.productId);
                            } else {
                              setQty(it.productId, newQty);
                              sync();
                            }
                          }}
                        />

                        <button
                          className="px-2 sm:px-3 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setQty(it.productId, it.qty + 1);
                            sync();
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="lg:hidden text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleRemoveItem(it.productId)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>

                      <button
                        className="hidden lg:flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleRemoveItem(it.productId)}
                      >
                        <TrashIcon className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px-56px)] flex items-center mb-24 lg:mb-0">
              <div className="w-full border border-gray-200 p-6 bg-white shadow-sm animate-fadeIn">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">
                      Subtotal ({selectedItems.length} items)
                    </span>
                    <span>Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 border-t border-gray-200 pt-3">
                    <span className="font-medium">Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-gray-900 mt-6 pt-4 border-t border-gray-300">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>

                <div className="mt-8">
                  <button
                    className="w-full px-4 py-3 bg-purple-900 text-white font-semibold hover:bg-purple-800 transition-colors disabled:bg-gray-400"
                    onClick={() => {
                      alert(
                        `Checkout successful (simulated). Thank you! Total: Rp ${total.toLocaleString(
                          "id-ID"
                        )}`
                      );

                      // only remove selected items, not clear all
                      const current = loadCart();
                      const remaining = current.filter(
                        (it) => !selectedItems.includes(it.productId)
                      );
                      localStorage.setItem("cart", JSON.stringify(remaining));
                      setSelectedItems([]);
                      sync();
                    }}
                    disabled={selectedItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md px-4 sm:px-6 py-3 flex justify-between items-center z-40 animate-slideUp">
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="form-checkbox h-5 w-5 text-purple-800"
            />
            <span className="text-sm sm:text-base text-gray-900 font-medium">
              {selectAll ? "Deselect All" : "Select All"} ({selectedItems.length}{" "}
              selected)
            </span>
          </div>

          <button
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base"
            onClick={() => setShowClearModal(true)}
          >
            Clear Cart
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={showModal}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        onConfirm={confirmRemoval}
        onCancel={() => setShowModal(false)}
      />

      <ConfirmModal
        isOpen={showClearModal}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        onConfirm={confirmClearCart}
        onCancel={() => setShowClearModal(false)}
      />

      {toast && (
        <Toast
          message={toast.msg}
          onUndo={toast.undo}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
