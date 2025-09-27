// Imports: react-query, API, and types
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { Product } from "../types";

// Custom hook: fetch products by room
export function useProductsByRoom(roomKey?: string) {
  return useQuery<Product[], Error>({
    queryKey: ["productsByRoom", roomKey], // cache key
    queryFn: async () => {
      if (!roomKey) return []; // if no roomKey, return empty array
      const res = await api.get<Product[]>("/products", { params: { room: roomKey } });
      return res.data; // product list filtered by room
    },
    enabled: !!roomKey,             // only run if roomKey exists
    staleTime: 1000 * 60 * 5,       // cache for 5 minutes
  });
}
