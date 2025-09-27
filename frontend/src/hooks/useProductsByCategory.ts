// Imports: react-query, API, and types
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { Product } from "../types";

// Custom hook: fetch products by category
export function useProductsByCategory(categoryKey?: string) {
  return useQuery<Product[], Error>({
    queryKey: ["productsByCategory", categoryKey], // cache key
    queryFn: async () => {
      if (!categoryKey) return []; // no category → empty array
      const res = await api.get<Product[]>("/products", {
        params: { category: categoryKey }, // send category filter
      });
      return res.data; // product list by category
    },
    enabled: !!categoryKey,          // only run if categoryKey exists
    staleTime: 1000 * 60 * 5,        // cache for 5 minutes
  });
}
