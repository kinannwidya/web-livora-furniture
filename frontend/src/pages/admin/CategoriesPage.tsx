// Imports: React, DnD Kit, Router, components, APIs, and types
import { useEffect, useMemo, useState, useContext } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { UNSAFE_NavigationContext } from "react-router-dom";

import ItemForm from "../../components/admin/ItemForm";
import ItemModal from "../../components/admin/ItemModal";
import ItemCard, { type SimpleItem } from "../../components/admin/ItemCard";
import ItemCardOverlay from "../../components/admin/ItemCardOverlay";
import { CategoryAPI, UploadAPI } from "../../services/api";
import type { CategoryDoc } from "../../types";

/* ---------------------------
   Custom hook: useBlocker
   - Prevents navigation when `when` is true
   - Wraps router navigation with a blocker
---------------------------- */
function useBlocker(blocker: (tx: any) => void, when = true) {
  const { navigator }: any = useContext(UNSAFE_NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    const blockerWrapper = (tx: any) => {
      blocker(tx);
    };

    // Override navigator.push with blocker
    navigator.push = (...args: any[]) => {
      blockerWrapper({ retry: () => push.apply(navigator, args) });
    };

    // Cleanup: restore original push
    return () => {
      navigator.push = push;
    };
  }, [navigator, blocker, when]);
}

/* ---------------------------
   Sort helper
   - Featured first
   - Then by order (ascending)
   - Then by name (alphabetical)
---------------------------- */
function sortItems<T extends { featured?: boolean; order?: number; name: string }>(arr: T[]) {
  return [...arr].sort(
    (a, b) =>
      Number(!!b.featured) - Number(!!a.featured) ||
      (a.order ?? 0) - (b.order ?? 0) ||
      a.name.localeCompare(b.name)
  );
}

/* ---------------------------
    Page: Categories Management
---------------------------- */
export default function CategoriesPage() {
  // Data state
  const [items, setItems] = useState<CategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Layout management state
  const [manageMode, setManageMode] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  // Create state
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Edit state
  const [editing, setEditing] = useState<CategoryDoc | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Drag & drop overlay state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [invalidTargetId, setInvalidTargetId] = useState<string | null>(null);

  // Unsaved changes modal state
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);

  // Cached list of category IDs
  const ids = useMemo(() => items.map((it) => it._id), [items]);

  // Load categories from API
  async function load() {
    setLoading(true);
    const res = await CategoryAPI.list();
    // Sort and ensure each item has an order (fallback to index)
    const sorted = sortItems<CategoryDoc>(res.data).map((it, i) => ({
      ...it,
      order: typeof it.order === "number" ? it.order : i,
    }));
    setItems(sorted);
    setLoading(false);
  }

  // Load on mount
  useEffect(() => {
    load();
  }, []);

  /* ---------------------------
      CREATE
  ---------------------------- */
  async function handleCreate(val: { key: string; name: string; imageFile: File | null }) {
    setCreating(true);
    try {
      let imageUrl = "";
      let publicId = "";
      // Upload image if provided
      if (val.imageFile) {
        const fd = new FormData();
        fd.append("image", val.imageFile);
        const up = await UploadAPI.upload(fd);
        imageUrl = up.data.url;
        publicId = up.data.publicId;
      }

      // Create new category
      await CategoryAPI.create({
        key: val.key,
        name: val.name,
        imageUrl,
        publicId,
      });

      await load();
      setShowCreate(false);
    } finally {
      setCreating(false);
    }
  }

  /* ---------------------------
      DELETE
  ---------------------------- */
  async function handleDelete(id: string) {
    const ok = confirm("Delete this category?");
    if (!ok) return;
    await CategoryAPI.remove(id);
    await load();
  }

  /* ---------------------------
      EDIT
  ---------------------------- */
  function onEdit(item: SimpleItem) {
    const found = items.find((it) => it._id === item._id) || null;
    setEditing(found);
  }

  async function onSubmitEdit(val: { key: string; name: string; imageFile: File | null }) {
    if (!editing) return;
    setSavingEdit(true);
    try {
      let finalUrl = editing.imageUrl || "";
      let finalPublicId = editing.publicId || "";

      // Upload new image if provided
      if (val.imageFile) {
        const fd = new FormData();
        fd.append("image", val.imageFile);
        const up = await UploadAPI.upload(fd);
        finalUrl = up.data.url;
        finalPublicId = up.data.publicId;
      }

      // Update category
      await CategoryAPI.update(editing._id, {
        key: val.key,
        name: val.name,
        imageUrl: finalUrl,
        publicId: finalPublicId,
      });

      setEditing(null);
      await load();
    } finally {
      setSavingEdit(false);
    }
  }

  /* ---------------------------
    FEATURED toggle
---------------------------- */
  async function onToggleFeatured(item: SimpleItem) {
    const next = !item.featured;
    await CategoryAPI.update(item._id, { featured: next });
    setItems((prev) =>
      // Re-sort after toggle; normalize orders
      sortItems<CategoryDoc>(
        prev.map((it) => (it._id === item._id ? { ...it, featured: next } : it))
      ).map((it, i) => ({ ...it, order: i }))
    );
    setUnsaved(true); // mark layout as dirty
  }

  /* ---------------------------
      DRAG & DROP handlers
  ---------------------------- */
  function onDragStart(e: any) {
    setActiveId(String(e.active.id));
  }

  function onDragOver(e: any) {
    const { active, over } = e;
    if (!over) return;
    const activeItem = items.find((it) => it._id === active.id);
    const overItem = items.find((it) => it._id === over.id);

    // Prevent drag between different featured groups
    if (activeItem && overItem && activeItem.featured !== overItem.featured) {
      setInvalidTargetId(over.id);
    } else {
      setInvalidTargetId(null);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setInvalidTargetId(null);
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeItem = items.find((it) => it._id === active.id);
    const overItem = items.find((it) => it._id === over.id);

    // Prevent moving across featured group
    if (activeItem && overItem && activeItem.featured !== overItem.featured) {
      return;
    }

    setUnsaved(true);
    setItems((prev) => {
      const oldIndex = prev.findIndex((it) => it._id === String(active.id));
      const newIndex = prev.findIndex((it) => it._id === String(over.id));
      const newArr = arrayMove(prev, oldIndex, newIndex);
      // Update order based on new positions
      return newArr.map((it, i) => ({ ...it, order: i }));
    });
  }

  function onDragCancel() {
    setInvalidTargetId(null);
    setActiveId(null);
  }

  /* ---------------------------
      Persist order to backend
  ---------------------------- */
  async function persistOrders() {
    const updates = items.map((it, index) =>
      CategoryAPI.update(it._id, { order: index })
    );
    await Promise.all(updates);
  }

  /* ---------------------------
      Manage mode toggle
  ---------------------------- */
  async function toggleManageMode() {
    if (manageMode) {
      try {
        setSavingLayout(true);
        if (unsaved) {
          await persistOrders();
        }
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

  /* ---------------------------
      Safety: warn before unload
  ---------------------------- */
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

  /* ---------------------------
      Safety: block navigation
  ---------------------------- */
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ---------------------------
        HEADER
    ---------------------------- */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Title + Add button */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories</h1>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="h-10 px-4 font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            {showCreate ? "Close" : "+ Add Category"}
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <ItemForm
            mode="create"
            type="category"
            submitting={creating}
            onSubmit={handleCreate}
          />
        )}

        {/* Row 2: Layout actions */}
        <div className="flex justify-end gap-2">
          {manageMode ? (
            <>
              <button
                onClick={toggleManageMode}
                disabled={savingLayout}
                className="h-10 px-4 font-semibold bg-purple-900 text-white hover:bg-purple-800 disabled:opacity-70"
              >
                {savingLayout ? "Saving…" : "Save Layout"}
              </button>

              <button
                onClick={() => {
                  if (unsaved) {
                    setShowUnsavedModal(true);
                  } else {
                    setManageMode(false);
                    load();
                  }
                }}
                className="h-10 px-4 font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setManageMode(true)}
              className="h-10 px-4 font-semibold bg-purple-900 text-white hover:bg-purple-800 transition-colors"
            >
              Manage Layout
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------
        LIST (with DnD)
    ---------------------------- */}
      {loading ? (
        <div className="text-gray-500 text-center">Loading...</div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((it) => (
                <ItemCard
                  key={it._id}
                  item={it}
                  manageMode={manageMode}
                  invalidDrop={invalidTargetId === it._id}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  onToggleFeatured={onToggleFeatured}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <ItemCardOverlay
                item={items.find((it) => it._id === activeId)!}
                manageMode={manageMode}
                onEdit={onEdit}
                onDelete={handleDelete}
                onToggleFeatured={onToggleFeatured}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ---------------------------
        EDIT MODAL
    ---------------------------- */}
      <ItemModal
        open={!!editing}
        title="Edit Category"
        type="category"
        initial={{
          key: editing?.key,
          name: editing?.name,
          imageUrl: editing?.imageUrl,
        }}
        submitting={savingEdit}
        onClose={() => setEditing(null)}
        onSubmit={onSubmitEdit}
      />

      {/* ---------------------------
        UNSAVED CHANGES MODAL
    ---------------------------- */}
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
                  load();
                  setShowUnsavedModal(false);
                  pendingTx?.retry();
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
                  pendingTx?.retry();
                }}
                className="px-3 py-1 bg-purple-900 text-white hover:bg-purple-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
