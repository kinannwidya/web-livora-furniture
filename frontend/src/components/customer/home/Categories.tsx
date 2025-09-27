// src/components/customer/sections/home/Categories.tsx

// Imports: router, icons, hook, and state
import { Link } from "react-router-dom";
import { RiSofaLine } from "react-icons/ri";
import { useCategories } from "../../../hooks/useCategories";
import { useState } from "react";

// Categories section component
export default function Categories() {
  // Fetch categories data
  const { data: categories = [], isLoading, isError } = useCategories(true);
  // Track active index for mobile carousel
  const [activeIdx, setActiveIdx] = useState(0);

  // Loading state (skeletons)
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 w-full bg-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <p className="text-sm text-red-600">Failed to load categories.</p>
      </section>
    );
  }

  // Handle card click (mobile: select → click again to go)
  const handleCardClick = (i: number, key: string) => {
    if (i === activeIdx) {
      window.location.href = `/categories/${key}`;
    } else {
      setActiveIdx(i);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {/* Left info panel */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 leading-snug">
            Shop <br /> by Categories
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:block">
            <div className="flex items-center gap-3 text-gray-600">
              <RiSofaLine className="w-8 h-8 text-purple-900" />
              <p>
                <span className="font-semibold">200+</span>
                <br />
                <span className="text-sm">Unique products</span>
              </p>
            </div>
            <Link
              to="/categories"
              className="text-sm font-medium text-purple-900 hover:text-purple-700 border-b border-purple-200 inline-block"
            >
              All categories →
            </Link>
          </div>
        </div>

        {/* Right content */}
        <div className="md:col-span-3">
          {/* Mobile view: carousel effect */}
          <div className="relative h-[280px] sm:h-[500px] md:hidden overflow-hidden">
            {categories.map((cat, i) => {
              // Style based on position (center, left, right, hidden)
              let className =
                "absolute inset-0 mx-auto w-1/2 aspect-[4/5] cursor-pointer transition-all duration-500 ease-in-out shadow-lg";
              if (i === activeIdx) {
                className +=
                  " scale-100 opacity-100 z-20 shadow-xl shadow-gray-500/50 ring-1 ring-purple-200/50";
              } else if (
                i === (activeIdx - 1 + categories.length) % categories.length
              ) {
                className += " -translate-x-16 scale-85 opacity-70 z-10";
              } else if (i === (activeIdx + 1) % categories.length) {
                className += " translate-x-16 scale-85 opacity-70 z-10";
              } else {
                className += " scale-75 opacity-0 z-0";
              }

              const isCenter = i === activeIdx;

              return (
                <div
                  key={cat._id}
                  className={className}
                  onClick={() => handleCardClick(i, cat.key)}
                >
                  {/* Category image or fallback */}
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name || "Category image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 grid place-items-center text-xs opacity-70">
                      No Image
                    </div>
                  )}
                  {/* Overlay info */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-900/50 to-transparent">
                    <h3 className="text-sm font-semibold text-white">
                      {cat.name}
                    </h3>
                  </div>
                  {/* Dark overlay for non-center cards */}
                  {!isCenter && <div className="absolute inset-0 bg-black/40" />}
                </div>
              );
            })}
          </div>

          {/* Desktop view: grid layout */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-6">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-3">
                No categories available.
              </p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/categories/${cat.key}`}
                  className="relative group h-48 w-full overflow-hidden"
                >
                  {/* Category image or fallback */}
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name || "Category image"}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 grid place-items-center text-xs opacity-70">
                      No Image
                    </div>
                  )}
                  {/* Overlay info */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
                    <h3 className="text-base font-semibold text-white">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
