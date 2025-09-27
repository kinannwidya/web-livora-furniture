import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, type ComponentType } from "react";
import { clearAuth, getAuth } from "../utils/auth";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  HomeModernIcon,
  Square3Stack3DIcon,
  PlusIcon,
  BuildingStorefrontIcon 
} from "@heroicons/react/24/solid";

export default function AdminLayout() {
  const nav = useNavigate();
  const auth = getAuth();
  const [open, setOpen] = useState(false);

  // Tailwind styles aligned with PublicLayout (light + purple accent)
  const linkBase =
    "flex items-center gap-3 px-4 py-2 text-sm transition-colors border-l-2";
  const linkActive =
    "border-purple-900 bg-purple-50 text-purple-900 font-semibold";
  const linkIdle =
    "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50";

  const NavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
  }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkIdle}`
      }
      onClick={() => setOpen(false)}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );

  // fixed header height = 56px (h-14). Sidebar uses top-14 and calc(100vh-3.5rem)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar (sticky, light, matches sidebar) */}
      <header className="sticky top-0 z-40 h-14 bg-white border-b border-gray-200">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <Link
              to="/admin/dashboard"
              className="text-base sm:text-lg font-bold tracking-tight text-gray-900"
            >
              Admin Panel
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {auth?.user && (
              <>
                <span className="hidden sm:inline text-sm text-gray-600">
                  {auth.user.name} ({auth.user.role})
                </span>
                <button
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors"
                  onClick={() => {
                    clearAuth();
                    nav("/admin/login", { replace: true });
                  }}
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[240px_1fr]">
        {/* Sidebar (desktop, sticky & full-height) */}
        <aside className="hidden md:flex bg-white border-r border-gray-200">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] w-[240px] flex flex-col overflow-y-auto">
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="text-xs uppercase tracking-wider text-gray-500">
                Navigation
              </div>
            </div>

            <nav className="flex-1 py-3 space-y-1">
              <NavItem
                to="/admin/dashboard"
                icon={Square3Stack3DIcon}
                label="Products"
              />
              <NavItem to="/admin/add" icon={PlusIcon} label="Add Product" />

              <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wider text-gray-400">
                Taxonomy
              </div>
              <NavItem
                to="/admin/categories"
                icon={Squares2X2Icon}
                label="Categories"
              />
              <NavItem to="/admin/rooms" icon={HomeModernIcon} label="Rooms" />
            </nav>

            <div className="mt-auto border-t border-gray-200">
  <Link
    to="/"
    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
    aria-label="View Storefront"
  >
    <BuildingStorefrontIcon className="w-5 h-5" />
    View Storefront
  </Link>
</div>
          </div>
        </aside>

        {/* Sidebar (mobile drawer) */}
        {open && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col border-r border-gray-200">
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div className="font-semibold text-gray-900">Admin Panel</div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  aria-label="Close sidebar"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 py-3 space-y-1">
                <NavItem
                  to="/admin/dashboard"
                  icon={Square3Stack3DIcon}
                  label="Products"
                />
                <NavItem to="/admin/add" icon={PlusIcon} label="Add Product" />
                <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wider text-gray-400">
                  Taxonomy
                </div>
                <NavItem
                  to="/admin/categories"
                  icon={Squares2X2Icon}
                  label="Categories"
                />
                <NavItem to="/admin/rooms" icon={HomeModernIcon} label="Rooms" />
              </nav>

              <div className="mt-auto border-t border-gray-200">
                <Link
  to="/"
  onClick={() => setOpen(false)}
  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
  aria-label="View Storefront"
>
  <BuildingStorefrontIcon className="w-5 h-5" />
  View Storefront
</Link>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
