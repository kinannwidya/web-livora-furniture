import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { CategoryAPI, RoomAPI } from "../../services/api";
import type { Product, CategoryDoc, RoomDoc } from "../../types";
import { TrashIcon } from "@heroicons/react/24/solid";

/**
 * ProductForm — dynamic categories/rooms (no more hard-coded unions!)
 * - Loads categories & rooms from API
 * - Works for create/edit
 * - Sends category/room by KEY (backend also accepts ID)
 * - Breadcrumbs + Unsaved changes indicator + beforeunload guard + leave modal
 */

type Props = { mode: "create" | "edit" };

// helper: only keep digits
function onlyDigits(val: string): number {
  const clean = val.replace(/\D/g, "");
  return clean === "" ? 0 : Number(clean);
}

export default function ProductForm({ mode }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dynamic options
  const [cats, setCats] = useState<CategoryDoc[]>([]);
  const [rooms, setRooms] = useState<RoomDoc[]>([]);

  // Local form state (keep category/room as KEY strings for simplicity)
  const [form, setForm] = useState<{
    _id?: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    stock: number;
    brand: string;
    origin: string;
    weight: number;
    dimensions: string;
    material: string;
    imageUrl: string;
    publicId: string;
    categoryKey: string; // e.g., "sofa"
    roomKey: string; // e.g., "living-room"
  }>({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    brand: "",
    origin: "",
    weight: 0,
    dimensions: "",
    material: "",
    imageUrl: "",
    publicId: "",
    categoryKey: "",
    roomKey: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // For unsaved indicator / leave guards
  const [initialSnapshot, setInitialSnapshot] = useState<string>(""); // JSON snapshot
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavTo, setPendingNavTo] = useState<string | null>(null);

  // Derived for price preview
  const finalPrice = useMemo(() => {
    const price = Number(form.price) || 0;
    const disc = Math.min(Math.max(Number(form.discount) || 0, 0), 100);
    return price * (1 - disc / 100);
  }, [form.price, form.discount]);

  // Helper: take a snapshot of current form+file for dirty checks
  function snap(obj: typeof form, f: File | null) {
    return JSON.stringify({
      ...obj,
      // we don't snapshot _id; and for file use name+size for quick compare
      _id: undefined,
      __file__: f ? { name: f.name, size: f.size, type: f.type } : null,
    });
  }

  const isDirty = useMemo(() => snap(form, file) !== initialSnapshot, [form, file, initialSnapshot]);

  // Load categories & rooms (then product if edit)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [cRes, rRes] = await Promise.all([CategoryAPI.list(), RoomAPI.list()]);
        if (!isMounted) return;
        setCats(cRes.data);
        setRooms(rRes.data);

        if (mode === "edit" && id) {
          const pRes = await api.get<Product>(`/products/${id}`);
          if (!isMounted) return;

          const catKey =
            typeof pRes.data.category === "object" && pRes.data.category
              ? (pRes.data.category as any).key
              : (() => {
                const found = cRes.data.find((c: CategoryDoc) => c._id === pRes.data.category);
                return found?.key || "";
              })();
          const roomKey =
            typeof pRes.data.room === "object" && pRes.data.room
              ? (pRes.data.room as any).key
              : (() => {
                const found = rRes.data.find((r: RoomDoc) => r._id === pRes.data.room);
                return found?.key || "";
              })();

          const next = {
            _id: pRes.data._id,
            name: pRes.data.name || "",
            description: pRes.data.description || "",
            price: pRes.data.price ?? 0,
            discount: pRes.data.discount ?? 0,
            stock: pRes.data.stock ?? 0,
            brand: pRes.data.brand || "",
            origin: pRes.data.origin || "",
            weight: pRes.data.weight ?? 0,
            dimensions: pRes.data.dimensions || "",
            material: pRes.data.material || "",
            imageUrl: pRes.data.imageUrl || "",
            publicId: pRes.data.publicId || "",
            categoryKey: catKey,
            roomKey: roomKey,
          };
          setForm(next);
          // set snapshot AFTER setting form
          const s = snap(next, null);
          setInitialSnapshot(s);
        } else {
          // create mode: snapshot of empty form
          const s = snap(
            {
              ...form,
              // ensure empty default (in case state initializer ever changes)
              name: "",
              description: "",
              price: 0,
              discount: 0,
              stock: 0,
              brand: "",
              origin: "",
              weight: 0,
              dimensions: "",
              material: "",
              imageUrl: "",
              publicId: "",
              categoryKey: "",
              roomKey: "",
            },
            null
          );
          setInitialSnapshot(s);
        }
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  // Revoke object URL to avoid memory leaks
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // beforeunload guard
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty && !saving) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, saving]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  }

  function handleDeleteImage() {
    setFile(null);
    setForm((f) => ({ ...f, imageUrl: "", publicId: "" }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;
      let publicId = form.publicId;

      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const resUpload = await api.post("/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = resUpload.data.url;
        publicId = resUpload.data.publicId;
      }

      const payload: any = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        discount: Number(form.discount ?? 0),
        stock: Number(form.stock ?? 0),
        brand: form.brand.trim(),
        origin: form.origin.trim(),
        weight: Number(form.weight ?? 0),
        dimensions: form.dimensions.trim(),
        material: form.material.trim(),
        imageUrl,
        publicId,
        category: form.categoryKey,
        room: form.roomKey,
      };

      if (mode === "create") {
        await api.post("/products", payload);
      } else if (mode === "edit" && form._id) {
        await api.put(`/products/${form._id}`, payload);
      }

      navigate("/admin/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  // Navigate with dirty-check (for breadcrumb click)
  function guardedNavigate(to: string) {
    if (isDirty && !saving) {
      setPendingNavTo(to);
      setShowLeaveModal(true);
      return;
    }
    navigate(to);
  }

  if (loading) return <div>Loading...</div>;

  const currentImageSrc = file ? URL.createObjectURL(file) : form.imageUrl;
  const fileNameDisplay = file ? file.name : form.imageUrl ? "Image already uploaded" : "No file chosen";

  const pageTitle = mode === "create" ? "Add Product" : "Edit Product";

  return (
    <div className="max-w-full space-y-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
        <ol className="list-reset inline-flex items-center gap-1">
          <li>
            <button
              onClick={() => guardedNavigate("/admin/dashboard")}
              className="text-gray-600 hover:text-gray-900 underline underline-offset-2"
              title="Back to Products"
              type="button"
            >
              Products
            </button>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{pageTitle}</li>
        </ol>
      </nav>

      {/* Header row with unsaved indicator */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        <div className="text-sm">
          {isDirty ? (
            <span className="inline-flex items-center gap-2 text-yellow-700">
              <span className="inline-block w-2 h-2 bg-yellow-500 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-gray-400">All changes saved</span>
          )}
        </div>
      </div>

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        {/* Basic Info - 2 Columns */}
        <div className="bg-white p-4 border grid gap-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Name</span>
              <input
                className="border p-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Brand</span>
              <input
                className="border p-2"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              />
            </label>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Category</span>
              <select
                className="border p-2 capitalize"
                value={form.categoryKey}
                onChange={(e) => setForm((f) => ({ ...f, categoryKey: e.target.value }))}
                required
              >
                <option value="">-- select category --</option>
                {cats.map((c) => (
                  <option key={c._id} value={c.key}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Room</span>
              <select
                className="border p-2 capitalize"
                value={form.roomKey}
                onChange={(e) => setForm((f) => ({ ...f, roomKey: e.target.value }))}
                required
              >
                <option value="">-- select room --</option>
                {rooms.map((r) => (
                  <option key={r._id} value={r.key}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Pricing & Stock - 3 Columns */}
        <div className="bg-white p-4 border grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Price (Rp)</span>
            <input
              className="border p-2"
              type="text"
              inputMode="numeric"
              value={form.price ? String(form.price) : ""}
              onChange={(e) => setForm((f) => ({ ...f, price: onlyDigits(e.target.value) }))}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Discount (%)</span>
            <input
              className="border p-2"
              type="text"
              inputMode="numeric"
              value={form.discount ? String(form.discount) : ""}
              onChange={(e) => setForm((f) => ({ ...f, discount: onlyDigits(e.target.value) }))}
            />
            <span className="text-xs text-gray-600 mt-1">
              Final price: <b>Rp {Math.round(finalPrice).toLocaleString("id-ID")}</b>
            </span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Stock</span>
            <input
              className="border p-2"
              type="text"
              inputMode="numeric"
              value={form.stock ? String(form.stock) : ""}
              onChange={(e) => setForm((f) => ({ ...f, stock: onlyDigits(e.target.value) }))}
            />
          </label>
        </div>

        {/* Dimensions & Material - 3 Columns */}
        <div className="bg-white p-4 border grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Origin</span>
            <input
              className="border p-2"
              value={form.origin}
              onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Weight (grams)</span>
            <input
              className="border p-2"
              type="text"
              inputMode="numeric"
              value={form.weight ? String(form.weight) : ""}
              onChange={(e) => setForm((f) => ({ ...f, weight: onlyDigits(e.target.value) }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Dimensions</span>
            <input
              className="border p-2"
              placeholder="e.g. 200x100x50 cm"
              value={form.dimensions}
              onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Material</span>
            <input
              className="border p-2"
              placeholder="e.g. solid wood, steel, rattan"
              value={form.material}
              onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
            />
          </label>
        </div>

        {/* Description & Image - Full Width */}
        <div className="bg-white p-4 border grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Description</span>
            <textarea
              className="border p-2"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Image</span>
            <div className="flex gap-2 items-center border p-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-input"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-input"
                className="px-4 py-2 bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 transition-colors"
              >
                Choose File
              </label>
              <span className="text-gray-500 text-sm flex-1 truncate">{fileNameDisplay}</span>
              {(file || form.imageUrl) && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            {currentImageSrc && (
              <img src={currentImageSrc} alt="preview" className="h-32 object-contain mt-2" />
            )}
          </div>
        </div>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            className="border px-6 py-2 bg-purple-900 text-white font-semibold disabled:opacity-50 hover:bg-purple-800 transition-colors"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : mode === "create" ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Leave (Unsaved) Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-md max-w-sm w-full">
            <h2 className="font-semibold text-lg mb-2">Unsaved Changes</h2>
            <p className="text-sm text-gray-600 mb-4">
              You have unsaved changes. Do you want to save before leaving?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLeaveModal(false);
                  setPendingNavTo(null);
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  const to = pendingNavTo || "/admin/dashboard";
                  setShowLeaveModal(false);
                  setPendingNavTo(null);
                  navigate(to);
                }}
                className="px-3 py-1 bg-purple-900 text-white hover:bg-purple-800"
              >
                Leave without saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
