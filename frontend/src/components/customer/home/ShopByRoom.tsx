// Imports: router and custom hook for featured rooms
import { Link } from "react-router-dom";
import { useFeaturedRooms } from "../../../hooks/useRooms";

// ShopByRoom section component
export default function ShopByRoom() {
  // Fetch featured rooms (limit 6)
  const { data: rooms = [], isLoading, isError } = useFeaturedRooms(6);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-20">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Room</h2>
        <Link
          to="/rooms"
          className="text-sm text-purple-900 hover:text-purple-700 transition"
        >
          View all →
        </Link>
      </div>

      {/* Loading state (skeleton) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 md:h-36 w-full bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        // Error state
        <p className="text-sm text-red-600">Failed to load rooms.</p>
      ) : rooms.length ? (
        // Room cards
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Link
              key={room._id}
              to={`/rooms/${room.key}`}
              className="relative group h-20 md:h-36 w-full overflow-hidden border border-gray-200 hover:border-purple-300 transition"
            >
              {/* Room image */}
              <img
                src={room.imageUrl || "/images/default-room.jpg"}
                alt={room.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

              {/* Overlay text: center on mobile, bottom-left on desktop */}
              <div className="absolute inset-0 flex items-center justify-center md:items-end md:justify-start md:p-3">
                <h3 className="text-sm md:text-base font-semibold text-white text-center md:text-left">
                  {room.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Empty state
        <p className="text-sm text-gray-500">No featured rooms yet.</p>
      )}
    </section>
  );
}
