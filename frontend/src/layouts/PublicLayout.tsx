// src/layouts/PublicLayout.tsx
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  UserIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CartBadge from "../components/common/CartBadge";
import ScrollToTop from "../components/common/ScrollToTop";
import SearchBar from "../components/customer/CustSearchBar";
import Footer from "../components/customer/Footer";
import api from "../services/api";
import type { Product } from "../types";

export default function PublicLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const isShopActive =
    pathname.startsWith("/products") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/rooms");

  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSearch(q: string) {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await api.get<Product[]>(`/products/search?q=${q}`);
      setSuggestions(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="px-6 md:px-12 py-3 md:py-4 flex items-center justify-between bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="font-bold text-2xl tracking-widest text-gray-900"
          >
            LIVORA
          </NavLink>
          {/* Desktop nav (unchanged) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Home
            </NavLink>

            <div className="relative group">
              <NavLink
                to="/products"
                className={`transition ${
                  isShopActive
                    ? pathname.startsWith("/products")
                      ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                      : "text-gray-900 border-b-2 border-gray-900 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Shop
              </NavLink>

              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg border w-48 z-50">
                <NavLink
                  to="/products"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  All Products
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `block px-4 py-2 transition ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "hover:bg-gray-100 text-gray-700"
                    }`
                  }
                >
                  Shop by Category
                </NavLink>
                <NavLink
                  to="/rooms"
                  className={({ isActive }) =>
                    `block px-4 py-2 transition ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "hover:bg-gray-100 text-gray-700"
                    }`
                  }
                >
                  Shop by Room
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Blog
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              About
            </NavLink>
          </nav>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-6 text-gray-500">
          <div className="hidden md:block w-56">
            <SearchBar
              placeholder="Search products..."
              size="sm"
              suggestions={suggestions}
              onSearch={handleSearch}
            />
          </div>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center gap-1 text-sm transition ${
                isActive ? "text-purple-700" : "hover:text-gray-900"
              }`
            }
          >
            <UserIcon className="w-5 h-5" />
            <span className="hidden md:block">Login</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex items-center transition ${
                isActive ? "text-purple-700" : "hover:text-gray-900"
              }`
            }
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <CartBadge />
          </NavLink>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1 text-gray-700 hover:text-purple-800"
          >
            <Bars3Icon className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end text-gray-600 hover:text-gray-900 mb-6"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-4 text-gray-700 text-sm font-medium">
              <NavLink to="/" end onClick={() => setMobileOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/products" onClick={() => setMobileOpen(false)}>
                All Products
              </NavLink>
              <NavLink to="/categories" onClick={() => setMobileOpen(false)}>
                Shop by Category
              </NavLink>
              <NavLink to="/rooms" onClick={() => setMobileOpen(false)}>
                Shop by Room
              </NavLink>
              <NavLink to="/blog" onClick={() => setMobileOpen(false)}>
                Blog
              </NavLink>
              <NavLink to="/about" onClick={() => setMobileOpen(false)}>
                About
              </NavLink>
              <NavLink to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </NavLink>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 px-0 md:px-10 py-0 md:py-10 max-w-7xl mx-auto w-full">
        <ScrollToTop />
        <Outlet />
      </main>

      {/* Footer hidden di cart page */}
      {!pathname.startsWith("/cart") && <Footer />}
    </div>
  );
}
