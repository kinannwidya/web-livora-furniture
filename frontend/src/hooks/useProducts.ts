// src/hooks/useProducts.ts

// Imports: react-query, API, and types
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { Product } from "../types";

// Custom hook: fetch all products
export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ["products"],        // cache key
    queryFn: async () => {
      const res = await api.get<Product[]>("/products");
      return res.data;             // raw product list
    },
    staleTime: 1000 * 60 * 5,      // cache for 5 minutes
  });
}
