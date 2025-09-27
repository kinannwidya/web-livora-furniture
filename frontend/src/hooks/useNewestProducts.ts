// src/hooks/useNewestProducts.ts

// Imports: React hooks, types, and API
import { useEffect, useState } from "react";
import type { Product } from "../types";
import api from "../services/api";

// Custom hook: fetch newest product IDs
export default function useNewestProducts(limit = 5) {
  const [newestIds, setNewestIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // Fetch all products
        const res = await api.get<Product[]>("/products");
        if (!alive) return;

        // Sort by createdAt (newest first)
        const sorted = (res.data || []).sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );

        // Save only newest product IDs (limited)
        setNewestIds(sorted.slice(0, limit).map((p) => String(p._id)));
      } catch (e) {
        console.error("Failed to load newest products", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    // Cleanup on unmount
    return () => {
      alive = false;
    };
  }, [limit]);

  // Return newest product IDs + loading state
  return { newestIds, loading };
}
