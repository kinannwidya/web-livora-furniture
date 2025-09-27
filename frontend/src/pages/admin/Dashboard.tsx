import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Link } from "react-router-dom";

import api, { CategoryAPI } from "../../services/api";
import type { CategoryDoc } from "../../types";
import ProductCardOverlay from "../../components/admin/ProductCardOverlay";
import ProductCard from "../../components/admin/ProductCardAdmin";
import type { ProductDoc } from "../../components/admin/ProductCardAdmin";
import { useBlocker } from "../../hooks/useBlocker";

/* ---------------------------
   Helpers
---------------------------- */
function sortFeaturedByOrderName<T extends { order?: number; name: string }>(arr: T[]) {
  return [...arr].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
  );
}

function categoryKeyOf(p: ProductDoc) {
  return typeof p.category === "object" && p.category
    ? (p.category as CategoryDoc).key
    : "";
}

/* ---------------------------
   Page: Products Admin
---------------------------- */
export default function Dashboard() {
  const [allProducts, setAllProducts] = useState<ProductDoc[]>([]);
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);
  const [manageMode, setManageMode] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);

  /* Load products & categories */
  async function load() {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      api.get<ProductDoc[]>("/products"),
      CategoryAPI.list(),
    ]);
    setAllProducts(prodRes.data);
    setCategories(catRes.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  /* Delete product */
  async function handleDelete(id: string) {
    const ok = confirm("Delete this product?");
    if (!ok) return;
    await api.delete(`/products/${id}`);
    await load();
  }

  /* Toggle Featured */
  const [confirmUnfeatureId, setConfirmUnfeatureId] = useState<string | null>(null);
  const productToUnfeature = useMemo(
    () => allProducts.find((x) => x._id === confirmUnfeatureId) || null,
    [confirmUnfeatureId, allProducts]
  );

  function requestToggleFeatured(p: ProductDoc) {
    if (manageMode && p.featured) {
      setConfirmUnfeatureId(p._id);
      return;
    }
    void doToggleFeatured(p._id, !p.featured);
  }

  async function doToggleFeatured(id: string, next: boolean) {
    await api.put(`/products/${id}`, { featured: next });
    setAllProducts((prev) => {
      const updated = prev.map((it) =>
        it._id === id ? { ...it, featured: next } : it
      );
      if (next) {
        const maxOrder = Math.max(
          -1,
          ...updated.filter((x) => x.featured).map((x) => x.order ?? -1)
        );
        return updated.map((x) =>
          x._id === id ? { ...x, order: maxOrder + 1 } : x
        );
      }
      return updated;
    });
    setUnsaved(true);
  }

  /* Derived state */
  const featured = useMemo(
    () =>
      sortFeaturedByOrderName(
        allProducts.filter((x) => !!x.featured).map((x) => ({ ...x }))
      ),
    [allProducts]
  );
  const featuredIds = useMemo(() => featured.map((it) => it._id), [featured]);

  const visibleProducts = useMemo(() => {
    if (!activeCategoryKey) return allProducts;
    return allProducts.filter((p) => categoryKeyOf(p) === activeCategoryKey);
  }, [allProducts, activeCategoryKey]);

  /* DnD Handlers */
  function onDragStart(e: any) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = featured.findIndex((it) => it._id === String(active.id));
    const newIndex = featured.findIndex((it) => it._id === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = arrayMove(featured, oldIndex, newIndex).map((it, i) => ({
      ...it,
      order: i,
    }));
    setAllProducts((prev) =>
      prev.map((it) => {
        const f = moved.find((m) => m._id === it._id);
        return f ? { ...it, order: f.order } : it;
      })
    );
    setUnsaved(true);
  }

  function onDragCancel() {
    setActiveId(null);
  }

  async function persistOrders() {
    const updates = featured.map((it, index) =>
      api.put(`/products/${it._id}`, { order: index })
    );
    await Promise.all(updates);
  }

  /* Manage Mode Toggle */
  async function toggleManageMode() {
    if (manageMode) {
      try {
        setSavingLayout(true);
        if (unsaved) await persistOrders();
        await load();
        setUnsaved(false);
        setManageMode(false);
      } finally {
        setSavingLayout(false);
      }
    } else {
      setManageMode(true);
    }
  }

  /* Unsaved changes protection */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (unsaved && manageMode) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [unsaved, manageMode]);

  useBlocker(
    (tx) => {
      if (unsaved && manageMode) {
        setPendingTx(tx);
        setShowUnsavedModal(true);
      } else {
        tx.retry();
      }
    },
    unsaved && manageMode
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      pressDelay: 200,
      activationConstraint: { distance: 5 },
    })
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleManageMode}
              disabled={savingLayout}
              className="h-10 px-4 font-semibold bg-purple-900 text-white hover:bg-purple-800 disabled:opacity-70"
            >
              {manageMode
                ? savingLayout
                  ? "Saving..."
                  : "Save Layout"
                : "Manage Featured"}
            </button>
            {!manageMode && (
              <Link
                to="/admin/add"
                className="h-10 inline-flex items-center gap-2 px-4 font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                + Add Product
              </Link>
            )}
          </div>
        </div>

        {manageMode ? (
          <>
            <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
              <ol className="list-reset inline-flex items-center gap-1">
                <li>
                  <button
                    onClick={() => {
                      if (unsaved) {
                        setShowUnsavedModal(true);
                      } else {
                        setManageMode(false);
                      }
                    }}
                    className="text-gray-600 hover:text-gray-900 underline underline-offset-2"
                    title="Back to Products"
                  >
                    Products
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">Arrange layout</li>
              </ol>
            </nav>
            <p className="text-sm text-gray-600">
              Drag & drop to reorder Featured products. Click the star to toggle.
              {unsaved && <span className="ml-2 text-yellow-700">* Unsaved changes</span>}
            </p>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategoryKey(null)}
                className={`px-3 py-1 border border-gray-300 text-sm transition ${
                  activeCategoryKey === null
                    ? "bg-purple-900 text-white border-gray-700"
                    : "bg-white text-gray-700 hover:border-gray-700"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategoryKey(cat.key)}
                  className={`px-3 py-1 border border-gray-300 text-sm capitalize transition ${
                    activeCategoryKey === cat.key
                      ? "bg-purple-900 text-white border-gray-700"
                      : "bg-white text-gray-700 hover:border-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-gray-500 text-center">Loading...</div>
      ) : manageMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <SortableContext items={featuredIds} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-2 gap-1 sm:gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  manageMode={true}
                  onRequestToggleFeatured={requestToggleFeatured}
                  onDelete={handleDelete}
                />
              ))}
              {featured.length === 0 && (
                <div className="text-sm text-gray-500 col-span-full">
                  No Featured products yet. Mark products as Featured in normal mode, then arrange them here.
                </div>
              )}
            </div>
          </SortableContext>

          <DragOverlay>
  {activeId ? (
    <ProductCardOverlay
      product={allProducts.find((p) => p._id === activeId)!}
      manageMode={true}
      onRequestToggleFeatured={requestToggleFeatured}
      onDelete={handleDelete}
    />
  ) : null}
</DragOverlay>
        </DndContext>
      ) : (
        <div className="grid grid-cols-2 gap-1 sm:gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {visibleProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              manageMode={false}
              onRequestToggleFeatured={requestToggleFeatured}
              onDelete={handleDelete}
            />
          ))}
          {visibleProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500 col-span-full">
              No products found.
            </div>
          )}
        </div>
      )}

      {/* UNSAVED MODAL */}
      {showUnsavedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-md max-w-sm w-full">
            <h2 className="font-semibold text-lg mb-2">Unsaved Changes</h2>
            <p className="text-sm text-gray-600 mb-4">
              You have unsaved layout changes. Do you want to save before leaving?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setUnsaved(false);
                  setManageMode(false);
                  setShowUnsavedModal(false);
                  pendingTx?.retry?.();
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Discard
              </button>
              <button
                onClick={async () => {
                  await persistOrders();
                  setUnsaved(false);
                  setManageMode(false);
                  await load();
                  setShowUnsavedModal(false);
                  pendingTx?.retry?.();
                }}
                className="px-3 py-1 bg-purple-900 text-white hover:bg-purple-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM UNFEATURE MODAL */}
      {confirmUnfeatureId && productToUnfeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-md max-w-sm w-full">
            <h2 className="font-semibold text-lg mb-2">Remove from Featured?</h2>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">{productToUnfeature.name}</span> will no longer appear in Featured picks. Continue?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmUnfeatureId(null)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = confirmUnfeatureId!;
                  setConfirmUnfeatureId(null);
                  await doToggleFeatured(id, false);
                }}
                className="px-3 py-1 bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
