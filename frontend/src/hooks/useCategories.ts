// src/hooks/useCategories.ts

// Imports: react-query, API, and types
import { useQuery } from "@tanstack/react-query";
import { CategoryAPI } from "../services/api";
import type { CategoryDoc } from "../types";

// Helper: sort categories
// - Featured first
// - Then by order (ascending)
// - Then by name (alphabetical)
function sortItems(arr: CategoryDoc[]): CategoryDoc[] {
  return [...arr].sort(
    (a, b) =>
      Number(!!b.featured) - Number(!!a.featured) || // featured first
      (a.order ?? 0) - (b.order ?? 0) ||             // order ascending
      a.name.localeCompare(b.name)                   // alphabetical
  );
}

// Custom hook: fetch categories
export function useCategories(topOnly = false, limit = 3) {
  return useQuery<CategoryDoc[], Error>({
    queryKey: ["categories", topOnly, limit],
    queryFn: async () => {
      const res = await CategoryAPI.list();
      return res.data; // raw data from API
    },
    select: (data) => {
      const all = sortItems(data);
      // If topOnly: filter featured & limit
      return topOnly ? all.filter(c => !!c.featured).slice(0, limit) : all;
    },
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });
}
