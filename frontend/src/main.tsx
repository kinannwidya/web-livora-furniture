// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages (public)
import UnderConstruction from "./pages/UnderConstruction";
import Home from "./pages/customer/Home";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import CategoriesPage from "./pages/customer/CategoriesPage";
import RoomsPage from "./pages/customer/RoomsPage";
import ProductsPage from "./pages/customer/ProductsPage";
import BlogPage from "./pages/customer/BlogPage";
import BlogDetailPage from "./pages/customer/BlogDetailPage";
import AboutPage from "./pages/customer/AboutPage";

// Pages (admin)
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductForm from "./pages/admin/ProductForm";
import Categories from "./pages/admin/CategoriesPage";
import Rooms from "./pages/admin/RoomsPage";

// ✅ Enable browser scroll restoration on navigation
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "auto";
}

// React Query client (used for API caching & data fetching)
const queryClient = new QueryClient();

// Application routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      // Public pages
      { index: true, element: <Home /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },

      // Category & room pages with optional keys
      { path: "categories/:categoryKey?", element: <CategoriesPage /> },
      { path: "rooms/:roomKey?", element: <RoomsPage /> },

      { path: "products", element: <ProductsPage /> },

      // Blog section
      { path: "blog", element: <BlogPage /> },
      { path: "blog/post/:id", element: <BlogDetailPage /> },

      // About page
      { path: "about", element: <AboutPage /> },

      // Temporary login placeholder
      {
        path: "login",
        element: (
          <UnderConstruction
            title="Login Coming Soon"
            message="The login page is still under development."
          />
        ),
      },
    ],
  },

  // ✅ Admin section
  { path: "/admin/login", element: <Login /> },
  {
    path: "/admin",
    element: <ProtectedRoute />, // Protects all admin routes
    children: [
      {
        element: <AdminLayout />, // Common admin layout
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "add", element: <ProductForm mode="create" /> },
          { path: "edit/:id", element: <ProductForm mode="edit" /> },
          { path: "categories", element: <Categories /> },
          { path: "rooms", element: <Rooms /> },
        ],
      },
    ],
  },
]);

// Mount React app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
