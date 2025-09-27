// src/components/ScrollToTop.tsx

// React + Router hooks
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// ScrollToTop component
// - Resets scroll position when navigating between pages
// - Special handling for categories/rooms pages (only reset on first enter)
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const isCategoriesPage = pathname.startsWith("/categories");
    const isRoomsPage = pathname.startsWith("/rooms");

    // Reset scroll for all pages except categories/rooms
    if (!isCategoriesPage && !isRoomsPage) {
      window.scrollTo(0, 0);
    }
    // Reset scroll when first entering categories
    else if (isCategoriesPage && !prevPath.current.startsWith("/categories")) {
      window.scrollTo(0, 0);
    }
    // Reset scroll when first entering rooms
    else if (isRoomsPage && !prevPath.current.startsWith("/rooms")) {
      window.scrollTo(0, 0);
    }

    prevPath.current = pathname;
  }, [pathname]);

  return null;
}
