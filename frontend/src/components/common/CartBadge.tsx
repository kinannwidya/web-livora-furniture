// React hooks and cart utility
import { useEffect, useState } from "react";
import { cartCount } from "../../utils/cart";

// CartBadge component (shows number of items in cart)
export default function CartBadge() {
  // Track cart item count
  const [count, setCount] = useState(cartCount());

  // Update count when cart changes or storage updates (multi-tab)
  useEffect(() => {
    const onUpdate = () => setCount(cartCount());
    window.addEventListener("cart:update", onUpdate as EventListener);
    window.addEventListener("storage", onUpdate); // triggered from other tabs
    return () => {
      window.removeEventListener("cart:update", onUpdate as EventListener);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  // Hide badge if count is 0
  if (!count) return null;

  // Render badge with count
  return (
    <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs border">
      {count}
    </span>
  );
}
