// src/pages/customer/ProductDetail.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import type { Product } from "../../types";
import { addToCart } from "../../utils/cart";

function slugToLabel(s: string) {
  return s.replace(/-/g, " ");
}

function getCategoryLabel(cat: unknown) {
  if (cat && typeof cat === "object") {
    const c = cat as { key?: string; name?: string };
    return c.name || (c.key ? slugToLabel(c.key) : "");
  }
  if (typeof cat === "string") return slugToLabel(cat);
  return "";
}

function getRoomLabel(room: unknown) {
  if (room && typeof room === "object") {
    const r = room as { key?: string; name?: string };
    return r.name || (r.key ? slugToLabel(r.key) : "");
  }
  if (typeof room === "string") return slugToLabel(room);
  return "";
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: p, isLoading, error } = useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get<Product>(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const [added, setAdded] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error.message}</div>;
  if (!p) return <div>Product not found</div>;

  const discount = Math.min(Math.max(p.discount || 0, 0), 100);
  const finalPrice = Math.round((p.price || 0) * (1 - discount / 100));
  const inStock = (p.stock ?? 0) > 0;

  function handleAddToCart() {
    if (!p) return;
    addToCart(p, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto px-8 md:px-6 py-6 md:py-0 grid gap-8 md:grid-cols-2">
      {/* Image */}
      <div className="bg-white shadow w-full h-64 sm:h-80 md:h-[500px] overflow-hidden">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 grid place-items-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between space-y-6 relative">
        <div className="space-y-4">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>

          {/* Title + Brand */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {p.name}
            </h1>
            {p.brand && (
              <div className="text-sm text-gray-600">
                Brand:{" "}
                <span className="font-medium text-gray-800">{p.brand}</span>
              </div>
            )}
          </div>

          {/* Price block */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {discount > 0 ? (
              <>
                <span className="text-sm md:text-lg line-through text-gray-500">
                  Rp {(p.price || 0).toLocaleString("id-ID")}
                </span>
                <span className="text-xl md:text-2xl font-semibold text-purple-900">
                  Rp {finalPrice.toLocaleString("id-ID")}
                </span>
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700">
                  -{discount}%
                </span>
              </>
            ) : (
              <span className="text-xl md:text-2xl font-semibold text-purple-900">
                Rp {(p.price || 0).toLocaleString("id-ID")}
              </span>
            )}
            <span
              className={`px-2 py-0.5 text-xs ${
                inStock
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {inStock ? `Stock: ${p.stock}` : "Out of Stock"}
            </span>
          </div>

          {p.description && (
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {p.description}
            </p>
          )}

          {/* Specs */}
          <div className="border-t pt-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {p.origin && (
                <>
                  <dt className="text-gray-500">Origin</dt>
                  <dd className="text-gray-800">{p.origin}</dd>
                </>
              )}
              {p.material && (
                <>
                  <dt className="text-gray-500">Material</dt>
                  <dd className="text-gray-800">{p.material}</dd>
                </>
              )}
              {p.weight != null && p.weight > 0 && (
                <>
                  <dt className="text-gray-500">Weight</dt>
                  <dd className="text-gray-800">{p.weight} g</dd>
                </>
              )}
              {p.dimensions && (
                <>
                  <dt className="text-gray-500">Dimensions</dt>
                  <dd className="text-gray-800">{p.dimensions}</dd>
                </>
              )}
              {p.category && (
                <>
                  <dt className="text-gray-500">Category</dt>
                  <dd className="text-gray-800">
                    {getCategoryLabel(p.category as unknown)}
                  </dd>
                </>
              )}
              {p.room && (
                <>
                  <dt className="text-gray-500">Room</dt>
                  <dd className="text-gray-800">
                    {getRoomLabel(p.room as unknown)}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3 relative">
          <div className="relative">
            <button
              className={`w-full ${
                inStock
                  ? "bg-purple-900 hover:bg-purple-800 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } py-3 font-medium transition`}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock ? "+ Add to Cart" : "Out of Stock"}
            </button>

            {added && (
              <div className="absolute -top-8 right-0 flex items-center gap-1 bg-green-600 text-white px-3 py-1 text-xs shadow">
                <CheckIcon className="w-4 h-4" />
                Added to cart
              </div>
            )}
          </div>

          <button
            className="w-full border border-gray-300 py-3 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            disabled={!inStock}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
