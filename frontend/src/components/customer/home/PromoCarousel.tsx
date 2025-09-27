// src/components/customer/PromoCarousel.tsx

// Imports: React hooks and icons
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Banner type definition
type PromoBanner = {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  img: string;
};

// Props for carousel
type Props = {
  banners: PromoBanner[];
};

// PromoCarousel component
export default function PromoCarousel({ banners }: Props) {
  // Track current banner index
  const [bannerIdx, setBannerIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Navigation handlers
  const next = () => setBannerIdx((i) => (i + 1) % banners.length);
  const prev = () => setBannerIdx((i) => (i - 1 + banners.length) % banners.length);

  // Auto-play every 5 seconds
  useEffect(() => {
    timerRef.current = window.setInterval(() => next(), 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-20">
      <div className="relative overflow-hidden">
        {/* Banner track (slides horizontally) */}
        <div
          className="whitespace-nowrap transition-transform duration-500"
          style={{ transform: `translateX(-${bannerIdx * 100}%)` }}
        >
          {banners.map((b) => (
            <div
              key={b.id}
              className="inline-block align-top w-full h-[120px] md:h-[240px] relative"
            >
              {/* Banner image */}
              <img
                src={b.img}
                alt={b.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="relative z-10 h-full flex items-center px-4 md:px-15">
                <div className="text-white">
                  <h3 className="text-md md:text-2xl font-bold">{b.title}</h3>
                  <p className="text-xs md:text-sm mt-1 opacity-90">{b.subtitle}</p>

                  {/* Call-to-action button */}
                  <button
                    type="button"
                    onClick={() =>
                      console.log(`Promo CTA clicked (dummy) for banner ${b.id}`)
                    }
                    className="inline-block mt-3 md:mt-4 px-3 py-1.5 md:px-5 md:py-2 bg-white text-gray-900 text-xs md:text-base font-medium hover:bg-gray-100 transition-colors"
                  >
                    {b.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev/Next controls (desktop only) */}
        <button
          aria-label="Prev banner"
          onClick={prev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/40 text-white p-2"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          aria-label="Next banner"
          onClick={next}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/40 text-white p-2"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="mt-2 md:mt-3 flex justify-center gap-1.5 md:gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`h-1 w-4 md:h-1.5 md:w-6 ${
                i === bannerIdx ? "bg-gray-900" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
