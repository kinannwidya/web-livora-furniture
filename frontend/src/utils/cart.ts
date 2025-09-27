import type { Product } from "../types";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  qty: number;
  addedAt?: number; // timestamp kapan produk masuk cart
};

const KEY = "cart";

function dispatchChange() {
  // biar header bisa update badge otomatis
  window.dispatchEvent(new CustomEvent("cart:update"));
}

export function loadCart(): CartItem[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  dispatchChange();
}

export function addToCart(p: Product, qty = 1) {
  const items = loadCart();
  const idx = items.findIndex((i) => i.productId === p._id);

  if (idx >= 0) {
    // kalau sudah ada → tambah qty + update timestamp
    items[idx].qty += qty;
    items[idx].addedAt = Date.now();

    // pindahin ke atas
    const [updated] = items.splice(idx, 1);
    items.unshift(updated);
  } else {
    // kalau baru → taruh di atas dengan timestamp
    items.unshift({
      productId: p._id!,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      qty,
      addedAt: Date.now(),
    });
  }

  saveCart(items);
}

export function setQty(productId: string, qty: number) {
  const items = loadCart();
  const idx = items.findIndex((i) => i.productId === productId);
  if (idx >= 0) {
    if (qty <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].qty = qty;
    }
    saveCart(items);
  }
}

export function removeItem(productId: string) {
  saveCart(loadCart().filter((i) => i.productId !== productId));
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(): number {
  return loadCart().reduce((a, b) => a + b.qty, 0);
}

export function cartTotal(): number {
  return loadCart().reduce((a, b) => a + b.price * b.qty, 0);
}
