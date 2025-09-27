// Imports: React, router, API, and types
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryAPI } from "../../services/api";
import type { CategoryDoc } from "../../types";

// Helper: sort categories (featured → order → name)
function sortItems<T extends { featured?: boolean; order?: number; name: string }>(arr: T[]): T[] {
  return [...arr].sort(
    (a, b) =>
      Number(!!b.featured) - Number(!!a.featured) ||
      (a.order ?? 0) - (b.order ?? 0) ||
      a.name.localeCompare(b.name)
  );
}

// Footer component
export default function Footer() {
  const [categories, setCategories] = useState<CategoryDoc[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryAPI.list();
        const all = sortItems<CategoryDoc>(res.data);
        setCategories(all.slice(0, 4)); // show only 4 categories
      } catch (e) {
        console.error("Failed to load categories in footer", e);
      }
    })();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Col 1: Brand intro */}
        <div className="md:col-span-4">
          <h4 className="text-xl font-bold text-white tracking-widest mb-4">
            LIVORA
          </h4>
          <p className="text-sm leading-relaxed">
            High-quality furniture crafted with passion and precision to
            transform your living spaces.
          </p>
        </div>

        {/* Col 2-3: Quick Links + Categories */}
        <div className="grid grid-cols-2 gap-8 md:col-span-4 md:grid-cols-2">
          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-purple-400 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-purple-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-purple-400 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories (from API) */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
              Categories
            </h5>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/categories/${cat.key}`}
                      className="hover:text-purple-400 transition-colors capitalize"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading...</li>
              )}
            </ul>
          </div>
        </div>

        {/* Col 4: Contact info */}
        <div className="md:col-span-4">
          <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
            Contact
          </h5>
          <p className="text-sm">123 Furniture Lane, Design City, DC 12345</p>
          <p className="text-sm mt-2">
            Email: <span className="text-gray-300">info@livora.com</span>
          </p>
          <p className="text-sm mt-2">
            Phone: <span className="text-gray-300">+1 (234) 567-890</span>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-8 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500 tracking-wide">
          &copy; {new Date().getFullYear()} LIVORA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
