import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "./utils/auth";
import CartBadge from "./components/common/CartBadge";

export default function App() {
  const nav = useNavigate();
  const auth = getAuth();

  return (
    <div className="min-h-full">
      <header className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold">🪑 Furniture Store</Link>
          <nav className="text-sm flex items-center gap-3">
            <Link to="/">Home</Link>
            <Link to="/cart">Cart <CartBadge /></Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {auth?.user ? (
            <>
              <Link to="/admin/dashboard" className="text-sm underline">Admin Dashboard</Link>
              <span className="text-sm opacity-80">
                {auth.user.name} ({auth.user.role})
              </span>
              <button
                className="px-3 py-1 border"
                onClick={() => {
                  clearAuth();
                  nav("/", { replace: true });
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="text-sm underline">Admin Login</Link>
          )}
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
