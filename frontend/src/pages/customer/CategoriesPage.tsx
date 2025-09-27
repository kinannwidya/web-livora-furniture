// src/pages/customer/CategoriesPage.tsx
import { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useCategories } from "../../hooks/useCategories";
import { useProductsByCategory } from "../../hooks/useProductsByCategory";
import ProductCard from "../../components/customer/ProductCard";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categoryKey } = useParams<{ categoryKey?: string }>();

  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: products = [], isLoading: prodLoading } =
    useProductsByCategory(categoryKey);

  // Auto-pilih kategori pertama kalau URL kosong
  useEffect(() => {
    if (!categoryKey && categories.length) {
      const first = categories.find((c) => c.featured) ?? categories[0];
      navigate(`/categories/${first.key}`, { replace: true });
    }
  }, [categoryKey, categories, navigate]);

  const activeCategoryName = useMemo(
    () => categories.find((c) => c.key === categoryKey)?.name,
    [categories, categoryKey]
  );

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-20 space-y-12">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-800 mb-6 mt-2"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Shop by Categories
          </h1>
          <p className="text-base mt-2 text-gray-600">
            Discover a wide range of curated furniture collections by category.
          </p>
        </header>

        {/* Category selector */}
        {catLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 w-full bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile: grid 2 kolom gap-1 */}
            <div className="grid grid-cols-2 gap-1 md:hidden">
              {categories.map((cat) => {
                const isActive = categoryKey === cat.key;
                return (
                  <button
                    key={cat._id}
                    onClick={() =>
                      navigate(`/categories/${cat.key}`, { replace: true })
                    }
                    aria-pressed={isActive}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative h-20 overflow-hidden border-2 transition ${
                      isActive
                        ? "border-purple-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 grid place-items-center text-xs opacity-70">
                        No Image
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition ${
                        isActive
                          ? "bg-black/70"
                          : "bg-black/50 hover:bg-black/60"
                      }`}
                    >
                      <span className="text-white text-sm font-semibold text-center px-2">
                        {cat.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desktop: slider */}
            <div className="hidden md:block">
              <Swiper
                spaceBetween={16}
                slidesPerView={3}
                breakpoints={{
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
              >
                {categories.map((cat) => {
                  const isActive = categoryKey === cat.key;
                  return (
                    <SwiperSlide key={cat._id}>
                      <button
                        onClick={() =>
                          navigate(`/categories/${cat.key}`, { replace: true })
                        }
                        aria-pressed={isActive}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative w-full h-32 overflow-hidden border-4 transition ${
                          isActive
                            ? "border-purple-800"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 grid place-items-center text-xs opacity-70">
                            No Image
                          </div>
                        )}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition ${
                            isActive
                              ? "bg-black/80"
                              : "bg-black/50 group-hover:bg-black/60"
                          }`}
                        >
                          <span className="text-white text-lg font-semibold">
                            {cat.name}
                          </span>
                        </div>
                      </button>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </>
        )}

        {/* Products */}
        {categoryKey && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
              {activeCategoryName || "Selected Category"}
            </h2>

            {prodLoading ? (
              <div className="grid grid-cols-2 gap-1 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-72 w-full bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-2 gap-1 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Belum ada produk dalam kategori ini.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
