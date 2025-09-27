// src/pages/admin/Login.tsx
import bglivora from "../../assets/bg-livora.webp";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

import api from "../../services/api";
import { saveAuth } from "../../utils/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@livora.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await api.post("auth/login", { email, password });
      saveAuth(res.data);
      nav("/admin/dashboard", { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full font-sans text-gray-800 bg-gray-50 flex">
      <div className="grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-2 flex-1">
        {/* Left: Branding & Welcome */}
        <div
          className="relative flex flex-col justify-between p-8 sm:p-12 text-white bg-cover bg-center min-h-[300px] lg:min-h-full"
          style={{ backgroundImage: `url(${bglivora})` }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gray-900/60"></div>

          <h1 className="relative z-10 font-bold text-2xl lg:text-3xl tracking-widest">
            LIVORA
          </h1>

          <div className="relative z-10 max-w-md space-y-3 mt-6 lg:mt-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide">
              Welcome Back, Admin
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300">
              Manage your store, products, and orders with our seamless admin
              panel.
            </p>
          </div>

          {/* Desktop-only footer */}
          <div className="relative z-10 text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-4 lg:mt-0 mb-4 lg:mb-0 hidden lg:block">
            © 2025 LIVORA. All rights reserved.
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 bg-white">
          <div className="max-w-sm mx-auto w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Login to Admin Panel
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Enter your credentials to continue.
            </p>

            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Email Address
                </span>
                <input
                  className="p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 transition"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
                <input
                  className="p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 transition"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </label>

              {err && (
                <div className="text-red-600 text-sm font-medium mt-1">
                  {err}
                </div>
              )}

              <button
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 
                           text-white font-medium bg-gray-900 hover:bg-gray-700 
                           transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
