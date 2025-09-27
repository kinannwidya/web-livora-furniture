import type { User } from "../types";

const KEY = "auth";

export function saveAuth(payload: { token: string; user: User }) {
  localStorage.setItem(KEY, JSON.stringify(payload));
}
export function getAuth(): { token: string; user: User } | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
export function getToken(): string | null {
  return getAuth()?.token ?? null;
}
export function clearAuth() {
  localStorage.removeItem(KEY);
}
export function isAuthed(): boolean {
  return !!getToken();
}
