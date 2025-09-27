// src/pages/customer/RoomsPage.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRooms } from "../../hooks/useRooms";
import { useProductsByRoom } from "../../hooks/useProductsByRoom";
import ProductCard from "../../components/customer/ProductCard";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function RoomsPage() {
  const { roomKey } = useParams<{ roomKey?: string }>();
  const navigate = useNavigate();

  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const { data: products = [], isLoading: productsLoading } =
    useProductsByRoom(roomKey);

  // Auto pilih room pertama kalau URL kosong
  useEffect(() => {
    if (!roomKey && rooms.length) {
      const first = rooms.find((r) => r.featured) ?? rooms[0];
      navigate(`/rooms/${first.key}`, { replace: true });
    }
  }, [roomKey, rooms, navigate]);

  const activeRoomName = useMemo(
    () => rooms.find((r) => r.key === roomKey)?.name,
    [rooms, roomKey]
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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Shop by Room</h1>
          <p className="text-base mt-2 text-gray-600">
            Find inspiration and products tailored to each room in your home.
          </p>
        </div>

        {/* Room selector */}
        {roomsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 w-full bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile: grid 2 kolom gap-1 */}
            <div className="grid grid-cols-2 gap-1 md:hidden">
              {rooms.map((room) => {
                const isActive = roomKey === room.key;
                return (
                  <button
                    key={room._id}
                    onClick={() =>
                      navigate(`/rooms/${room.key}`, { replace: true })
                    }
                    aria-pressed={isActive}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative h-14 overflow-hidden border-2 transition ${
                      isActive
                        ? "border-purple-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {room.imageUrl ? (
                      <img
                        src={room.imageUrl}
                        alt={room.name}
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
                        {room.name}
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
                  1024: { slidesPerView: 4 },
                }}
              >
                {rooms.map((room) => {
                  const isActive = roomKey === room.key;
                  return (
                    <SwiperSlide key={room._id}>
                      <button
                        onClick={() =>
                          navigate(`/rooms/${room.key}`, { replace: true })
                        }
                        aria-pressed={isActive}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative w-full h-32 overflow-hidden border-4 transition ${
                          isActive
                            ? "border-purple-800"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {room.imageUrl ? (
                          <img
                            src={room.imageUrl}
                            alt={room.name}
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
                              ? "bg-white/0"
                              : "bg-black/60 group-hover:bg-black/0"
                          }`}
                        >
                          <span className="text-white text-sm font-semibold">
                            {room.name}
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
        {roomKey && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeRoomName || "Selected Room"}
            </h2>

            {productsLoading ? (
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
              <p className="text-gray-500">No products found in this room.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
