// src/components/ProtectedRoute.tsx

// Import router helpers and auth utility
import { Navigate, Outlet } from "react-router-dom";
import { isAuthed } from "../../utils/auth";

// ProtectedRoute component
// - If user is authenticated → render child routes (Outlet)
// - If not → redirect to home page
export default function ProtectedRoute() {
  return isAuthed() ? <Outlet /> : <Navigate to="/" replace />;
}
