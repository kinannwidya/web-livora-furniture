import axios from "axios"; 

// Create a reusable Axios instance for API requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // no fallback, harus dari .env
  withCredentials: false,
});

// ✅ Interceptor: inject Authorization token into every request if available
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const { token } = JSON.parse(raw) as { token?: string };
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`; // attach Bearer token
      }
    } catch {
      // ignore parsing errors
    }
  }
  return config;
});

export default api;

/* -----------------------------
   Category API helpers
----------------------------- */
export const CategoryAPI = {
  // List categories (accepts optional query params, e.g., { featured: true, limit: 3 })
  list: (params?: Record<string, any>) => api.get("categories", { params }),
  // Create a new category
  create: (data: any) => api.post("categories", data),
  // Update category by ID
  update: (id: string, data: any) => api.put(`categories/${id}`, data),
  // Delete category by ID
  remove: (id: string) => api.delete(`categories/${id}`),
};

/* -----------------------------
   Room API helpers
----------------------------- */
export const RoomAPI = {
  // List rooms (accepts optional query params, e.g., { featured: true, limit: 6 })
  list: (params?: Record<string, any>) => api.get("rooms", { params }),
  // Create a new room
  create: (data: any) => api.post("rooms", data),
  // Update room by ID
  update: (id: string, data: any) => api.put(`rooms/${id}`, data),
  // Delete room by ID
  remove: (id: string) => api.delete(`rooms/${id}`),
};

/* -----------------------------
   Upload API helpers
----------------------------- */
export const UploadAPI = {
  // Upload file (expects FormData with "image")
  upload: (formData: FormData) =>
    api.post("upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
