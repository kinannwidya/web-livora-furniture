// Imports: react-query, API, and types
import { useQuery } from "@tanstack/react-query";
import { RoomAPI } from "../services/api";
import type { RoomDoc } from "../types";

// Hook: fetch all rooms
export function useRooms() {
  return useQuery<RoomDoc[], Error>({
    queryKey: ["rooms"],            // cache key
    queryFn: async () => {
      const res = await RoomAPI.list();
      return res.data;              // all rooms from API
    },
    staleTime: 1000 * 60 * 10,      // cache for 10 minutes
  });
}

// Hook: fetch featured rooms (with optional limit)
export function useFeaturedRooms(limit = 6) {
  return useQuery<RoomDoc[], Error>({
    queryKey: ["rooms", "featured", limit], // cache key
    queryFn: async () => {
      const res = await RoomAPI.list({ featured: true, limit });
      const rooms: RoomDoc[] = res.data;
      return rooms
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) // sort by order
        .slice(0, limit);                                // limit results
    },
    staleTime: 1000 * 60 * 10,      // cache for 10 minutes
  });
}
